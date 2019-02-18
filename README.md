<p align="center">
<img src="./front-end/src/Resources/Gear-Tracker.png"/><br>
  <a href="http://gear-tracker.com">
    <img title="Gear Tracker" src="./miscellaneous/Responsive-Demonstration.png" />
  </a>
</p>


<p align="center"><a href="http://gear-tracker.com"> gear-tracker.com </a> <br/><br />A gear inventory system for the Outdoors Club at UVA.</p><p align="center">Currently supported on Google Chrome  and Safari only.</p>

## Purpose
Gear Tracker is a web application serving as the primary gear inventory/checkout management system for the [Outdoors Club at UVA](http://outdoorsatuva.org). Gear Tracker is still being actively worked on.<br>

Outdoors at UVa has over 1000 different pieces of equipment that members regularly ‘check out’ and borrow for a week at a time. Members come to ‘Gear Rooms’ - times when club officers make our gear storage spaces accessible to all members so that they may check gear out. During gear rooms, members pick out what gear they would like to check out, and list the numbers written on the gear to an officer, who then ‘checks out’ that gear under that member’s name. This application aims to help not only our general members by improving how they view gear, but it also aims to help the officers and Gearmasters with the pressure-ridden task of quickly checking out, checking in, and accessioning large amounts of gear in addition to helping the officers manage our inventory. <br/><br/>Gear Tracker is the first step in an effort to completely overhaul the Outdoors Club's current website, a complex piece of software that's critical to the functioning of UVA's largest student-run organization. To follow the current status of this effort, please visit [this repository](https://github.com/Zakinator123/Outdoors-At-UVa-Website-Spec).
<br/>
## Application Stack and Infrastructure
* Database(s):
    - MySQL database running in the back-end EC2 instance contains tables pertaining to session data, gear, and checkouts.
    - A MySQL database hosted by Pair Networks contains Outdoors at UVA's current website database, which has a 'Members' table that's used to authenticate users in Gear Tracker.

* Back-End: Flask app served with [uWSGI+nginx](http://flask.pocoo.org/docs/1.0/deploying/uwsgi/) on a [docker container](https://hub.docker.com/r/zakinator123/gear-app/~/dockerfile/) running in an AWS EC2 instance. The Flask app is a RESTful JSON API which makes raw SQL queries (via a Python MySQL Client) to the application MySQL instance mentioned above in addition to the Outdoors Club's MySQL database. HAProxy serves as an SSL Termination Proxy for the Flask App (Config file can be found [here](https://github.com/Zakinator123/Gear-App/blob/master/back-end/haproxy.cfg)), and also takes care of text compression.

* Front-End: ReactJS application running on a different [docker container](https://hub.docker.com/r/zakinator123/gear-app-react/~/dockerfile/) deployed on a different EC2 instance. Contains AJAX calls to the Flask back-end above to populate data tables as well as to make state-changing POST requests (if authenticated) for checking gear in/out. Uses [Material UI Next](https://material-ui-next.com/). HAProxy serves as an SSL Termination Proxy for the React App (Config file can be found [here](https://github.com/Zakinator123/Gear-App/blob/master/front-end/haproxy.cfg)), and also takes care of text compression.
<br/>

## Deployment System

<div align="center"><img src="./miscellaneous/Deployment-System.png" /></div>

 Upon any pushes to this GitHub repo, two automated image builds are triggered in their respective DockerHub repositories - these images are for the [Flask back-end](https://hub.docker.com/r/zakinator123/gear-app-react/~/dockerfile/) and [React front-end](https://hub.docker.com/r/zakinator123/gear-app-react/~/dockerfile/) containers. Upon successful image build(s), an [AWS Lambda function](https://github.com/Zakinator123/Gear-App/blob/master/miscellaneous/lambda_function.py) is triggered that programmatically SSH's into the EC2 instances containing the Flask and React apps. The programmatic SSH commands take down, update, and redeploy the back-end and front-end containers.
<br/>

## Author

* **Zakey Faieq**
* zaf2xk@virginia.edu

## License

-- This project is licensed under the terms of the [MIT license](https://github.com/Zakinator123/Gear-App/blob/master/LICENSE.txt).
