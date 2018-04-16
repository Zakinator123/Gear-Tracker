from flask import Flask
import MySQLdb
from flask import jsonify
import os

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello World"

@app.route("/gear/<number>")
def get_gear(number):
    db = MySQLdb.connect(os.environ['AWS_DB_HOST'], os.environ['AWS_DB_USER'], os.environ['AWS_DB_PASS'], os.environ['AWS_DB_DATABASE'])
    cursor = db.cursor()
    cursor.execute("SELECT * FROM gear WHERE number=" + number + ";")
    data1 = cursor.fetchone()
    db.close()

    return jsonify(data1)

@app.route("/user/<id>")
def get_user(id):
    db = MySQLdb.connect(os.environ['ODC_DB_HOST'], os.environ['ODC_DB_USER'], os.environ['ODC_DB_PASS'], os.environ['ODC_DB_DATABASE'])
    cursor = db.cursor()
    cursor.execute("SELECT * FROM m_member WHERE c_uid=" + id + ";")
    data2=cursor.fetchone()

    return jsonify(data2)

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=True, port=80)