#!/bin/bash

# This file belongs in the backend container and should be located in the /etc/cron.daily directory.

s3_bucket_name='s3://odc-gear/database-backups/'
timestamp=`TZ=America/New_York date '+%Y-%m-%dT%H:%M'`

sudo docker run -it --name mysql-cmdline --link mysql -v ~/database-backups/:/data mysql:5.7 bash /data/mysqldump-script.sh
sudo docker logs mysql-cmdline
sudo docker rm mysql-cmdline

aws s3 mv ~/database-backups/$timestamp-all-databases-backup.sql $s3_bucket_name
aws s3 mv ~/database-backups/$timestamp-data-only-backup.sql $s3_bucket_name
aws s3 mv ~/database-backups/$timestamp-schema-only-backup.sql $s3_bucket_name
