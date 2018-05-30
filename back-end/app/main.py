from flask import Flask
import MySQLdb
import MySQLdb.cursors
from flask import jsonify
import os
from flask_cors import CORS
from flask import request
import hmac
from functools import wraps

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return ("The Gear-App API is alive and well!!!")


@app.route("/login", methods=['POST'])
def login():
    post_body = request.get_json()

    # If login info is user: 'readonly', pass: 'readonly', give user a token value of 0
    if post_body['email'] == 'readonly' and post_body['password'] == 'readonly':
        return jsonify({'status': 'Success', 'token': '0', 'message': 'Successfully logged in as read-only user'})

    # Validate login info
    try:
        odc_db = MySQLdb.connect(os.environ['ODC_DB_HOST'], os.environ['ODC_DB_USER'], os.environ['ODC_DB_PASS'],
                                 os.environ['ODC_DB_DATABASE'])
        cursor = odc_db.cursor(MySQLdb.cursors.DictCursor)
        sql = "SELECT * FROM m_member WHERE c_email='%s' AND c_password='%s'" % (
        post_body['email'], post_body['password'])
        cursor.execute(sql)

        if cursor.rowcount == 0:
            return jsonify({'status': 'Error', 'message': 'Error on Login - incorrect email/password'})
    except Exception as e:
        exception_string = 'Error retrieving information from ODC database.' + str(e)
        return jsonify({'status': 'Error', 'message': exception_string})

    member = cursor.fetchone()
    # Check to see if user is an officer:
    if (member['c_group_memberships'] & 2 != 2):
        return jsonify({'status': 'Error', 'message': 'Login rejected: User is not an officer'})

    rds_db = MySQLdb.connect(os.environ['AWS_DB_HOST'], os.environ['AWS_DB_USER'], os.environ['AWS_DB_PASS'],
                             os.environ['AWS_DB_DATABASE'])
    cursor = rds_db.cursor(MySQLdb.cursors.DictCursor)

    member_id = member['c_uid']

    # Check if user is already logged in: If so, give them the current authenticator in the database if it isn't expired
    # TODO: Set an authenticator expiration policy
    sql = "SELECT * FROM authenticator WHERE userid=%d" % (member_id)
    cursor.execute(sql)

    if cursor.rowcount > 0:
        auth_token = cursor.fetchone()['token']
        return jsonify(
            {'status': 'Success', 'token': auth_token, 'message': 'Successfully logged in as privileged user'})

    # Generate an authenticator token for the user
    k = os.environ['SECRET_KEY']
    auth_token = hmac.new(
        key=k.encode('utf-8'),
        msg=os.urandom(32),
        digestmod='sha256',
    ).hexdigest()

    # Save the authenticator token to the database.
    sql = "INSERT INTO authenticator (token, userid) VALUES ('%s', '%d')" % (auth_token, member_id)
    cursor.execute(sql)
    rds_db.commit()

    return jsonify({'status': 'Success', 'token': auth_token, 'message': 'Successfully logged in as privileged user'})


@app.route("/logout", methods=['POST'])
def logout():
    post_body = request.get_json()
    token = post_body['token']

    if token == '0':
        return jsonify({'status': 'Success', 'message': "Successfully logged out of readonly user"})

    try:
        db = MySQLdb.connect(os.environ['AWS_DB_HOST'], os.environ['AWS_DB_USER'], os.environ['AWS_DB_PASS'],
                             os.environ['AWS_DB_DATABASE'])
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        sql = "DELETE FROM authenticator WHERE token='%s'" % (token)
        cursor.execute(sql)
        db.commit()
    except:
        return jsonify({'status': 'Error', 'message': 'Error deleting authenticator'})

    return jsonify({'status': 'Success', 'message': 'Successfully logged out'})


def authenticated_required(f):
    @wraps(f)
    def authenticate(*args, **kwargs):

        if 'token' not in request.headers.get('authorization'):
            return {'Status': 'Error', 'message': 'No authentication token in API request'}

        rds_db = MySQLdb.connect(os.environ['AWS_DB_HOST'], os.environ['AWS_DB_USER'], os.environ['AWS_DB_PASS'],
                                 os.environ['AWS_DB_DATABASE'])
        cursor = rds_db.cursor(MySQLdb.cursors.DictCursor)

        # Check if user is already logged in:
        sql = "SELECT * FROM authenticator WHERE authenticator='%s'" % (request.headers.get('authorization'))
        cursor.execute(sql)

        if cursor.rowcount > 0:
            authenticator_data = cursor.fetchone()
            # TODO: Check to make sure token isn't too old.
            return f(*args, **kwargs)
        else:
            return {'Status': 'Error', 'message': 'Invalid authentication'}

    return authenticate


@app.route("/gear/<number>")
def get_gear_by_number(number):
    db = MySQLdb.connect(os.environ['AWS_DB_HOST'], os.environ['AWS_DB_USER'], os.environ['AWS_DB_PASS'],
                         os.environ['AWS_DB_DATABASE'])
    cursor = db.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM gear WHERE number=" + number)
    data = cursor.fetchall()
    db.close()

    return jsonify(data)


@app.route("/gear/all")
def get_gear():
    db = MySQLdb.connect(os.environ['AWS_DB_HOST'], os.environ['AWS_DB_USER'], os.environ['AWS_DB_PASS'],
                         os.environ['AWS_DB_DATABASE'])
    cursor = db.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM gear;")
    data = cursor.fetchall()
    db.close()

    return jsonify(data)


### Commented out until a credential system is put into place to prevent user information
### and passwords being read by malicious users (Non-Hashed Passwords are returned by the database)
# @app.route("/user/<id>")
# def get_user_by_id(id):
#     db = MySQLdb.connect(os.environ['ODC_DB_HOST'], os.environ['ODC_DB_USER'], os.environ['ODC_DB_PASS'], os.environ['ODC_DB_DATABASE'])
#     cursor = db.cursor(MySQLdb.cursors.DictCursor)
#     cursor.execute("SELECT * FROM m_member WHERE c_uid=" + id)
#     data=cursor.fetchone()
#
#     return jsonify(data)

@app.route("/get_active_members")
def get_active_members():
    db = MySQLdb.connect(os.environ['ODC_DB_HOST'], os.environ['ODC_DB_USER'], os.environ['ODC_DB_PASS'],
                         os.environ['ODC_DB_DATABASE'])
    cursor = db.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute(
        "select m_member.c_uid, c_full_name, c_email from m_member, m_membership WHERE m_membership.c_member = m_member.c_uid and m_member.c_deleted < 1 and m_membership.c_begin_date <= current_date and m_membership.c_expiration_date >= current_date and m_membership.c_expiration_date != '2020-12-31' and m_membership.c_deleted < 1 order by m_member.c_last_name, m_member.c_first_name;")
    data = cursor.fetchall()

    return jsonify(data)

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=True, port=80)
