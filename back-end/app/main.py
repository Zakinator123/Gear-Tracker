from flask import Flask
import MySQLdb
import MySQLdb.cursors
from flask import jsonify
import os
from flask import render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return ("The Gear-App API is alive and well!!!")

@app.route("/gear/<number>")
def get_gear_by_number(number):
    db = MySQLdb.connect(os.environ['AWS_DB_HOST'], os.environ['AWS_DB_USER'], os.environ['AWS_DB_PASS'], os.environ['AWS_DB_DATABASE'])
    cursor = db.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM gear WHERE number=" + number + ";")
    data1 = cursor.fetchone()
    db.close()

    return jsonify(data1)

@app.route("/gear/all")
def get_gear():
    db = MySQLdb.connect(os.environ['AWS_DB_HOST'], os.environ['AWS_DB_USER'], os.environ['AWS_DB_PASS'], os.environ['AWS_DB_DATABASE'])
    cursor = db.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM gear;")
    data1 = cursor.fetchall()
    db.close()

    return jsonify(data1)

# Commented out for now to prevent user password visibility (Non-Hashed Passwords are returned by the database)
# @app.route("/user/<id>")
# def get_user_by_id(id):
#     db = MySQLdb.connect(os.environ['ODC_DB_HOST'], os.environ['ODC_DB_USER'], os.environ['ODC_DB_PASS'], os.environ['ODC_DB_DATABASE'])
#     cursor = db.cursor()
#     cursor.execute("SELECT * FROM m_member WHERE c_uid=" + id + ";")
#     data2=cursor.fetchone()
#
#     return jsonify(data2)





if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=True, port=80)