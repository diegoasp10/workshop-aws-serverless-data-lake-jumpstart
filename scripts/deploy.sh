#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./deploy.sh <aws_profile>"
  exit 1
fi

AWS_PROFILE=$1

PREFIX=$(jq -r '.prefix' < config/config.json)
AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text --profile $AWS_PROFILE)

STACK_ID="${PREFIX}-${AWS_ACCOUNT}-aws-serverless-data-lake-jumpstart-part-1"
STACK_NAME_PART_1="AwsServerlessDataLakeJumpstartPart1"
STACK_NAME_PART_2="AwsServerlessDataLakeJumpstartPart2"

echo "Login session sso using profile: $AWS_PROFILE"
aws sso login --profile $AWS_PROFILE

cd cdk

echo "Deploying $STACK_NAME_PART_1 stack using profile: $AWS_PROFILE"
cdk deploy "$STACK_NAME_PART_1" --profile $AWS_PROFILE

CRAWLER_NAME=$(aws cloudformation describe-stacks \
    --stack-name $STACK_ID \
    --query "Stacks[0].Outputs[?OutputKey=='ServerlessAnalyticsCrawlerName'].OutputValue" \
    --output text \
    --profile $AWS_PROFILE)

if [ -z "$CRAWLER_NAME" ]; then
  echo "Failed to retrieve the Glue Crawler name."
  exit 1
fi

echo "Starting Glue Crawler: $CRAWLER_NAME"
aws glue start-crawler --name $CRAWLER_NAME --profile $AWS_PROFILE

# Esperar hasta que el crawler termine
CRAWLER_STATE="RUNNING"
echo "Waiting for Glue Crawler: $CRAWLER_NAME to complete..."

while [ "$CRAWLER_STATE" != "READY" ]; do
  CRAWLER_STATE=$(aws glue get-crawler \
      --name $CRAWLER_NAME \
      --query "Crawler.State" \
      --output text \
      --profile $AWS_PROFILE)
  
  if [ "$CRAWLER_STATE" == "RUNNING" ] || [ "$CRAWLER_STATE" == "STOPPING" ]; then
    echo "Crawler is still running, waiting 30 seconds..."
    sleep 30
  elif [ "$CRAWLER_STATE" == "READY" ]; then
    echo "Crawler has completed successfully."
  else
    echo "Crawler is in unexpected state: $CRAWLER_STATE"
    exit 1
  fi
done

echo "Deploying $STACK_NAME_PART_2 stack using profile: $AWS_PROFILE"
cdk deploy "$STACK_NAME_PART_2" --profile $AWS_PROFILE

echo "Done!"
