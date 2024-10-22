import * as cdk from 'aws-cdk-lib';
import { CfnDataset, CfnProject, CfnRecipe } from 'aws-cdk-lib/aws-databrew';
import { Role, ServicePrincipal, ManagedPolicy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

interface AwsServerlessDataLakeJumpstartPart2Props extends cdk.StackProps {
    prefix: string;
    account: string;
    glueDatabaseName: string;
    glueTableName: string;
    serverlessAnalyticsBucket: Bucket;
    serverlessAnalyticsGlueBucket: Bucket;
}

export class AwsServerlessDataLakeJumpstartPart2 extends cdk.Stack {
    constructor(scope: Construct, id: string, props: AwsServerlessDataLakeJumpstartPart2Props) {
        super(scope, id, props);

        const serverlessAnalyticsDatabrewRole = new Role(this, 'ServerlessAnalyticsDatabrewRole', {
            roleName: `${props.prefix}-${props.account}-serverless-analytics-databrew-role`,
            assumedBy: new ServicePrincipal('databrew.amazonaws.com'),
        });
        serverlessAnalyticsDatabrewRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSGlueConsoleFullAccess'));
        serverlessAnalyticsDatabrewRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AwsGlueDataBrewFullAccessPolicy'));
        serverlessAnalyticsDatabrewRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));

        const serverlessAnalyticsDataBrewDataset = new CfnDataset(this, 'ServerlessAnalyticsDataBrewDataset', {
            name: `${props.prefix}-${props.account}-serverless-analytics-databrew-dataset`,
            input: {
                dataCatalogInputDefinition: {
                    catalogId: props.account,
                    databaseName: props.glueDatabaseName,
                    tableName: props.glueTableName,
                },
            },
        });

        const serverlessAnalyticsDataBrewRecipe = new CfnRecipe(this, 'ServerlessAnalyticsDataBrewRecipe', {
            name: `${props.prefix}-${props.account}-serverless-analytics-databrew-recipe`,
            steps: [],
        });

        const serverlessAnalyticsDataBrewProject = new CfnProject(this, 'ServerlessAnalyticsDataBrewProject', {
            name: `${props.prefix}-${props.account}-serverless-analytics-databrew-project`,
            datasetName: serverlessAnalyticsDataBrewDataset.name!,
            roleArn: serverlessAnalyticsDatabrewRole.roleArn,
            recipeName: serverlessAnalyticsDataBrewRecipe.name!,
        });
    }
}