# This file contains the AWS Lambda function that programmatically redeploys docker containers on the EC2 instances serving
# the Flask and React apps. The Lambda function is triggered when the docker images for the aforementioned containers
# build successfully on DockerHub.

# How I created the Lambda deployment package (ZIP File):
# To use paramiko in AWS Lambda, Lambda must be provided with a ZIP file containing all the needed dependencies.
# This ZIP file was created by zipping the site-packages folder of a python virtual environment (which
# contains paramiko and its dependencies). To prevent any binary incompatibility issues arising from differing machine
# architectures, this virtual environment was created on an EC2 instance that uses the same execution environment
# as AWS Lambda. The AMI name for this execution environment is 'amzn-ami-hvm-2017.03.1.20170812-x86_64-gp2'

import boto3
import paramiko
import os
import json
from base64 import b64decode

ENCRYPTED_REACT_HOST = os.environ['ec2_react_host']
DECRYPTED_REACT_HOST = boto3.client('kms').decrypt(CiphertextBlob=b64decode(ENCRYPTED_REACT_HOST))['Plaintext']

ENCRYPTED_FLASK_HOST = os.environ['ec2_flask_host']
DECRYPTED_FLASK_HOST = boto3.client('kms').decrypt(CiphertextBlob=b64decode(ENCRYPTED_FLASK_HOST))['Plaintext']

def lambda_handler(event, context):

    # Download private key file from secure S3 bucket
    s3_client = boto3.client('s3')
    s3_client.download_file('odc-gear','odc.pem', '/tmp/odc.pem')
    k = paramiko.RSAKey.from_private_key_file("/tmp/odc.pem")

    ###########################################################

    # SSH into EC2 instance serving the React application and stop, remove, update, and rerun docker container.
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=DECRYPTED_REACT_HOST, username="ubuntu", pkey=k)
    commands = [
                # React front-end deployment
                'sudo docker stop react-front-end',
                'sudo docker rm react-front-end',
                'sudo docker rmi zakinator123/gear-tracker-frontend:latest',
                'sudo docker pull zakinator123/gear-tracker-frontend',
                'sudo docker run -d --name react-front-end -p 8080:80 zakinator123/gear-tracker-frontend',
                'sudo service haproxy restart',
                ]

    # Execute the commands on the instance
    for command in commands:
        stdin, stdout, stderr = client.exec_command(command)
        print(stdout.read())
        print(stderr.read())
    client.close()

    ###########################################################

    # SSH into EC2 instance serving the Flask application and stop, remove, update, and rerun docker container.
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=DECRYPTED_FLASK_HOST, username="ubuntu", pkey=k)
    commands = [
        # Flask back-end deployment
        "sudo docker stop odc",
        "sudo docker rm odc",
        "sudo docker rmi zakinator123/gear-tracker-backend:latest",
        'sudo docker pull zakinator123/gear-tracker-backend',
        "sudo docker run -d --name odc --link mysql -p 8080:80 --env-file ./env_vars zakinator123/gear-tracker-backend",
        "sudo service haproxy restart",
    ]

    # Execute the commands on the instance
    for command in commands:
        stdin, stdout, stderr = client.exec_command(command)
        print(stdout.read())
        print(stderr.read())
    client.close()

    ###########################################################

    message = {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"message": "Success!"}),
        "isBase64Encoded": False
    }

    return message