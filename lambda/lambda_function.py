import boto3
import paramiko
import os
import json
from base64 import b64decode

ENCRYPTED_HOST = os.environ['ec2_host']
DECRYPTED_HOST = boto3.client('kms').decrypt(CiphertextBlob=b64decode(ENCRYPTED_HOST))['Plaintext']
ENCRYPTED_KEY = os.environ['ec2_ssh_key']
DECRYPTED_KEY = boto3.client('kms').decrypt(CiphertextBlob=b64decode(ENCRYPTED_KEY))['Plaintext']

def lambda_handler(event, context):

    # Download private key file from secure S3 bucket
    s3_client = boto3.client('s3')
    s3_client.download_file('odc-gear','odc.pem', '/tmp/odc.pem')

    # Connect to EC2 Instance Hosting the Web App
    k = paramiko.RSAKey.from_private_key_file("/tmp/odc.pem")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=DECRYPTED_HOST, username="ec2-user", pkey=k)

    # The commands below do the following:
    # 1. Update application container image
    # 2. Stop and remove existing container
    # 3. Provision a new container with updated image.
    commands = [
                'sudo docker pull zakinator123/gear-app',
                "sudo docker stop odc",
                "sudo docker rm odc",
                "sudo docker run -d --name odc -p 80:80 --env-file ./env_vars zakinator123/gear-app"
                ]

    # Execute the commands on the instance
    for command in commands:
        stdin, stdout, stderr = client.exec_command(command)
        print(stdout.read())
        print(stderr.read())

    message = {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"message": "Success!"}),
        "isBase64Encoded": False
    }

    return message