# This file contains the AWS Lambda function that programmatically redeploys docker containers on the EC2 instances serving
# the Flask and React apps. The Lambda function is triggered when the docker images for the aforementioned containers
# build successfully on DockerHub.

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
                'sudo docker rmi zakinator123/gear-app-react:latest',
                'sudo docker pull zakinator123/gear-app-react',
                'sudo docker run -d --name react-front-end -p 80:80 zakinator123/gear-app-react',
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
        "sudo docker rmi zakinator123/gear-app:latest",
        'sudo docker pull zakinator123/gear-app',
        "sudo docker run -d --name odc -p 8080:80 --env-file ./env_vars zakinator123/gear-app",
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