<h1 align="center"> Gear-App </h1> <br>
<p align="center">
  <a href="http://gear-app.com">
    <img title="GitPoint" src="./front-end/src/Layouts/ODC-logo.png" height=100 width=140 />
  </a>
</p>


<p align="center"><a href="http://gear-app.com"> gear-app.com </a> <br />A gear inventory system for the Outdoors Club at UVA.</p>

*******
This application is meant to serve as an improved gear inventory system for the Outdoors Club at UVA, which previously kept track of all of its gear on a Google Spreadsheet - an inefficient and suboptimal system.

## Application Stack
* Database(s):
    - AWS Aurora instance contains the 'Gear' database, which was created by importing a CSV that was extracted from the current Gear Inventory Spreadsheet.
        * Currently contains a single table for gear items. Will eventually contain a table for gear checkouts.
    - A MySQL database hosted by Pair Networks contains Outdoors at UVA's current website database, which has a 'Members' table.


* Back-End: Flask app on AWS EC2 served with [uWSGI+nginx](http://flask.pocoo.org/docs/1.0/deploying/uwsgi/) on a [docker container](https://hub.docker.com/r/zakinator123/gear-app/~/dockerfile/) that installs all the dependencies needed for [MySQLdb, a python MySQL client](https://github.com/PyMySQL/mysqlclient-python). The Flask app is a JSON API which makes raw SQL queries to the AWS RDS instance as well as the Outdoors Club's MySQL database.

* Front-End: ReactJS application running on a different [docker container](https://hub.docker.com/r/zakinator123/gear-app-react/~/dockerfile/) deployed on the same EC2 instance. Contains AJAX calls to the Flask back-end above to populate data tables in UI. Uses [Material UI Next](https://material-ui-next.com/).

## The Automated Deployment System

![Alt text](gear-app-deployment-system.png?raw=true "The system")

Upon any pushes to GitHub, two automated image builds are triggered in their respective DockerHub repositories - these images are for the Flask back-end and React front-end containers. Upon successful image build(s), an [AWS Lambda function](https://github.com/Zakinator123/Gear-App/blob/master/lambda/lambda_function.py) is triggered and programmatically SSH's into an EC2 instance to take down, update, and redeploy the back-end and front-end containers.


## Author

* **Zakey Faieq**
* zaf2xk@virginia.edu

## License

-- This project is licensed under the terms of the MIT license.