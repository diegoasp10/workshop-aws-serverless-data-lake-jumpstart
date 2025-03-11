import * as cdk from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { join } from "path";
import { Role, ServicePrincipal, PolicyStatement, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { CfnJob, CfnDatabase, CfnCrawler } from 'aws-cdk-lib/aws-glue';
import { Construct } from 'constructs';

interface AwsServerlessDataLakeJumpstartPart1Props extends cdk.StackProps {
    prefix: string;
    account: string;
}

export class AwsServerlessDataLakeJumpstartPart1 extends cdk.Stack {
    public readonly serverlessAnalyticsCatalog: CfnDatabase;
    public readonly serverlessAnalyticsBucket: Bucket;
    public readonly serverlessAnalyticsGlueBucket: Bucket;
    constructor(scope: Construct, id: string, props: AwsServerlessDataLakeJumpstartPart1Props) {
        super(scope, id, props);
    
        this.serverlessAnalyticsBucket = new Bucket(this, 'ServerlessAnalyticsBucket', {
            bucketName: `${props.prefix}-${props.account}-serverless-analytics`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        new BucketDeployment(this, 'DeployFilesToServerlessAnalyticsBucket', {
            sources: [Source.asset(join(__dirname, "..", "components", "s3", "serverless-analytics"))],
            destinationBucket: this.serverlessAnalyticsBucket,
            memoryLimit: 1024
        });

        this.serverlessAnalyticsGlueBucket = new Bucket(this, 'ServerlessAnalyticsGlueBucket', {
            bucketName: `${props.prefix}-${props.account}-serverless-analytics-glue`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        new BucketDeployment(this, 'DeployFilesToServerlessAnalyticsGlueBucket', {
            sources: [Source.asset(join(__dirname, "..", "components", "glue"))],
            destinationBucket: this.serverlessAnalyticsGlueBucket,
            memoryLimit: 1024
        });

        const serverlessAnalyticsJobRole = new Role(this, 'ServerlessAnalyticsJobRole', {
            roleName: `${props.prefix}-${props.account}-serverless-analytics-job-role`,
            assumedBy: new ServicePrincipal('glue.amazonaws.com'),
        });
        serverlessAnalyticsJobRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSGlueConsoleFullAccess'));
        serverlessAnalyticsJobRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AwsGlueDataBrewFullAccessPolicy'));
        serverlessAnalyticsJobRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));

        const serverlessAnalyticsJob = new CfnJob(this, 'ServerlessAnalyticsJob', {
            name: `${props.prefix}-${props.account}-serverless-analytics-job`,
            role: serverlessAnalyticsJobRole.roleArn,
            command: {
                name: 'glueetl',
                scriptLocation: `s3://${this.serverlessAnalyticsGlueBucket.bucketName}/spark/serverless_analytics_job.py`,
            },
            defaultArguments: {
                "--s3_input_uri": `s3a://${this.serverlessAnalyticsBucket.bucketName}/RAW_DATA/TAXI_ZONE_LOOKUP/taxi_zone_lookup.csv`,
                "--s3_output_uri": `s3a://${this.serverlessAnalyticsBucket.bucketName}/PARQUET_DATA/TAXI_ZONE_LOOKUP/`,
                "--job-bookmark-option": "job-bookmark-disable",
                "--enable-metrics": "true",
                "--conf": "spark.sql.parquet.datetimeRebaseModeInWrite=CORRECTED",
                "--enable-spark-ui": "true",
                "--enable-continuous-cloudwatch-log": "true",
                "--enable-continuous-log-filter": "true",
                "--job-log-prefix": "/aws-glue/jobs/output",
                "--enable-auto-scaling": "true"
            },
            description: "Serverless Analytics Job",
            executionProperty: {
                maxConcurrentRuns: 10,
            },
            maxCapacity: 10,
            timeout: 60,
            glueVersion: "4.0",
        });

        this.serverlessAnalyticsCatalog = new CfnDatabase(this, 'ServerlessAnalyticsCatalog', {
            catalogId: props.account,
            databaseInput: {
                name: `${props.prefix.replace(/-/g, '_')}_${props.account}_serverless_analytics_catalog`,
                locationUri: `s3://${this.serverlessAnalyticsBucket.bucketName}/PARQUET_DATA/`,
            }
        });

        const serverlessAnalyticsCrawler = new CfnCrawler(this, 'ServerlessAnalyticsCrawler', {
            name: `${props.prefix}-${props.account}-serverless-analytics-crawler`,
            role: serverlessAnalyticsJobRole.roleArn,
            databaseName: this.serverlessAnalyticsCatalog.ref,
            targets: {
                s3Targets: [
                    { path: `s3://${this.serverlessAnalyticsBucket.bucketName}/PARQUET_DATA/TAXI_ZONE_LOOKUP` },
                    { path: `s3://${this.serverlessAnalyticsBucket.bucketName}/PARQUET_DATA/YELLOW_TRIP_DATA` }
                ],
            },
            recrawlPolicy: {
                recrawlBehavior: "CRAWL_EVERYTHING",
            },
            schemaChangePolicy: {
                deleteBehavior: "DEPRECATE_IN_DATABASE",
                updateBehavior: "UPDATE_IN_DATABASE",
            },
            configuration: JSON.stringify({
                "Version": 1.0,
                "Grouping": {
                    "TableGroupingPolicy": "CombineCompatibleSchemas"
                },
                "CrawlerOutput": {
                    "Partitions": {
                        "AddOrUpdateBehavior": "InheritFromTable"
                    }
                }
            })
        });

        new cdk.CfnOutput(this, 'ServerlessAnalyticsCrawlerName', {
            value: serverlessAnalyticsCrawler.name!,
            description: 'Nombre del crawler de AWS Glue para Serverless Analytics',
            exportName: `${props.prefix}-${props.account}-serverless-analytics-crawler-name`
        });
    } 
}
