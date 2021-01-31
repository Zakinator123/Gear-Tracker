#!/bin/bash

# This should be located in the ~/database-backups/ directory

timestamp=`TZ=America/New_York date '+%Y-%m-%dT%H:%M'`

database_name='inventory'

echo $timestamp

mysqldump -h mysql -u${MYSQL_USER} -p${MYSQL_PASSWORD} --single-transaction --all-databases > /data/$timestamp-all-databases-backup.sql
mysqldump -h mysql -u${MYSQL_USER} -p${MYSQL_PASSWORD} --skip-add-drop-table --no-create-info --single-transaction $database_name  > /data/$timestamp-data-only-backup.sql
mysqldump -h mysql -u${MYSQL_USER} -p${MYSQL_PASSWORD} --skip-add-drop-table --no-data --single-transaction $database_name > /data/$timestamp-schema-only-backup.sql