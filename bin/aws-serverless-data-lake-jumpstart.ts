#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AwsServerlessDataLakeJumpstartPart1 } from '../lib/stacks/aws-serverless-data-lake-jumpstart-part-1';
import { AwsServerlessDataLakeJumpstartPart2 } from '../lib/stacks/aws-serverless-data-lake-jumpstart-part-2';

const app = new cdk.App();

const config = JSON.parse(readFileSync(join(__dirname, '..', 'config', 'config.json'), 'utf8'));
const prefix = config.prefix;

const tags = JSON.parse(readFileSync(join(__dirname, '..', 'config', 'tags.json'), 'utf8'));
const tagMap = tags.tags;

const awsAccount = process.env.CDK_DEFAULT_ACCOUNT;
const awsRegion = process.env.CDK_DEFAULT_REGION;

const awsServerlessDataLakeJumpstartPart1 = new AwsServerlessDataLakeJumpstartPart1(app, 'AwsServerlessDataLakeJumpstartPart1', {
  stackName: `${prefix}-${awsAccount}-aws-serverless-data-lake-jumpstart-part-1`,
  tags: tagMap,
  prefix: prefix,
  account: awsAccount!,
  env: {
    account: awsAccount,
    region: awsRegion,
  }
});

const awsServerlessDataLakeJumpstartPart2 = new AwsServerlessDataLakeJumpstartPart2(app, 'AwsServerlessDataLakeJumpstartPart2', {
  stackName: `${prefix}-${awsAccount}-aws-serverless-data-lake-jumpstart-part-2`,
  tags: tagMap,
  prefix: prefix,
  account: awsAccount!,
  env: {
    account: awsAccount,
    region: awsRegion,
  },
  glueDatabaseName: awsServerlessDataLakeJumpstartPart1.serverlessAnalyticsCatalog.ref,
  serverlessAnalyticsBucket: awsServerlessDataLakeJumpstartPart1.serverlessAnalyticsBucket,
  serverlessAnalyticsGlueBucket: awsServerlessDataLakeJumpstartPart1.serverlessAnalyticsGlueBucket,
  glueTableName: 'yellow_trip_data',
});