#pylint: disable=E0401,W0611,C0114,W0401,C0412,C0116
import sys
import boto3 # type: ignore
from awsglue.transforms import * # type: ignore
from awsglue.utils import getResolvedOptions # type: ignore
from pyspark.context import SparkContext # type: ignore
from awsglue.context import GlueContext  # type: ignore
from awsglue.job import Job # type: ignore

## @params: [JOB_NAME]
args = getResolvedOptions(sys.argv, [
    'JOB_NAME',
    's3_input_uri',
    's3_output_uri'
])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)
job.commit()

client_glue = boto3.client('glue')

def main():
    s3_input_uri = args['s3_input_uri']
    s3_output_uri = args['s3_output_uri']
    df = spark.read.csv(s3_input_uri, header=True, inferSchema=True)
    df.write.mode('overwrite').parquet(s3_output_uri)
    return True

if __name__ == "__main__":
    main()
