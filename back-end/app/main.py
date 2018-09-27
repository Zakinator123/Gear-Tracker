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
        odc_db = _setup_database_connection('ODC')
        cursor = odc_db.cursor(MySQLdb.cursors.DictCursor)
        sql = "SELECT * FROM m_member WHERE c_email='%s' AND c_password='%s'" % (
            post_body['email'], post_body['password'])
        cursor.execute(sql)
        odc_db.close()
        if cursor.rowcount == 0:
            return jsonify({'status': 'Error', 'message': 'Error on Login - incorrect email/password'})
    except Exception as e:
        exception_string = 'Error retrieving information from ODC database.' + str(e)
        return jsonify({'status': 'Error', 'message': exception_string})

    member = cursor.fetchone()
    # Check to see if user is an officer:
    if member['c_group_memberships'] & 2 != 2:
        return jsonify({'status': 'Error', 'message': 'Login rejected: User is not an officer'})

    rds_db = _setup_database_connection('AWS')
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
    rds_db.close()

    return jsonify({'status': 'Success', 'token': auth_token, 'message': 'Successfully logged in as privileged user'})


@app.route("/logout", methods=['POST'])
def logout():
    post_body = request.get_json()
    token = post_body['token']

    if token == '0':
        return jsonify({'status': 'Success', 'message': "Successfully logged out of readonly user"})

    try:
        db = _setup_database_connection('AWS')
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        sql = "DELETE FROM authenticator WHERE token='%s'" % (token)
        cursor.execute(sql)
        db.commit()
        db.close()
    except:
        return jsonify({'status': 'Error', 'message': 'Error deleting authenticator'})

    return jsonify({'status': 'Success', 'message': 'Successfully logged out'})


def authenticated_required(f):
    @wraps(f)
    def authenticate(*args, **kwargs):
        post_body = request.get_json()
        # if not post_body['authorization']:
        #     return {'Status': 'Error', 'message': 'No authentication token in API request'}

        db = _setup_database_connection('AWS')
        cursor = db.cursor(MySQLdb.cursors.DictCursor)

        # Check if user is already logged in:
        sql = "SELECT * FROM authenticator WHERE token='%s'" % (post_body['authorization'])
        cursor.execute(sql)

        db.close()
        if cursor.rowcount > 0:     
            authenticator_data = cursor.fetchone()
            # TODO: Check to make sure token isn't too old.
            return f(*args, **kwargs)
        else:
            return jsonify({'Status': 'Error', 'message': 'Invalid authentication'})
    return authenticate


@app.route("/gear/<number>")
def get_gear_by_number(number):
    db = _setup_database_connection('AWS')
    cursor = db.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM gear WHERE number=" + number)
    data = cursor.fetchall()
    db.close()

    for gear in data:
        if gear['number'] == -1:
            gear['number'] = "Numberless"

    return jsonify(data)

@app.route("/gear/uid/<uid>")
def get_gear_by_uid(uid):
    db = _setup_database_connection('AWS')
    cursor = db.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM gear WHERE uid=" + uid)
    data = cursor.fetchall()
    db.close()

    for gear in data:
        if gear['number'] == -1:
            gear['number'] = "Numberless"

    return jsonify(data)


@app.route("/gear/all")
def get_gear():
    db = _setup_database_connection('AWS')
    cursor = db.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM gear;")
    data = cursor.fetchall()
    db.close()

    for gear in data:
        if gear['number'] == -1:
            gear['number'] = "Numberless"

    return jsonify(data)

@app.route("/checkout/all")
def get_current_checkouts():
    db = _setup_database_connection('AWS')
    cursor = db.cursor(MySQLdb.cursors.DictCursor)

    cursor.execute(
        "SELECT DATE_FORMAT(checkout.date_checked_out,'%m/%d/%Y') AS date_checked_out , DATE_FORMAT(checkout.date_due,'%m/%d/%Y') AS date_due, checkout.checkout_id, checkout.gear_uid, checkout.officer_out, checkout.member_name, checkout.member_uid, gear.number, gear.item, gear.description, gear.status_level FROM checkout LEFT JOIN gear ON checkout.gear_uid = gear.uid WHERE gear.status_level!=0")
    data = cursor.fetchall()
    db.close()
    return jsonify(data)

#TODO: Get Old Checkouts


@app.route("/gear/checkout", methods=['POST'])
@authenticated_required
def checkout_gear():
    post_body = request.get_json()

    print(post_body)

    rds_db = _setup_database_connection('AWS')
    cursor = rds_db.cursor(MySQLdb.cursors.DictCursor)

    # Get officer name
    token = post_body['authorization']
    sql = "SELECT userid FROM authenticator WHERE token='%s'" % (token)
    cursor.execute(sql)
    officer_uid = cursor.fetchone()['userid']

    odc_db = _setup_database_connection('ODC')
    cursor = odc_db.cursor(MySQLdb.cursors.DictCursor)
    sql = "SELECT * FROM m_member WHERE c_uid=%d" % (officer_uid)
    cursor.execute(sql)
    officer_name = cursor.fetchone()['c_full_name']

    sql = "SELECT * FROM m_member WHERE c_email='%s'" % (post_body['memberEmail'])
    cursor.execute(sql)
    member_uid = cursor.fetchone()['c_uid']
    odc_db.close()

    cursor = rds_db.cursor(MySQLdb.cursors.DictCursor)
    print(officer_name)

    old_datetime = (post_body['dueDate'] + ':00')
    sql_datetime = old_datetime.replace('T', ' ')

    not_checked_out = []
    already_checked_out = []
    for gear in post_body['gear']:
        sql = "SELECT * FROM checkout WHERE gear_uid=%d AND checkout_status=%d" % (gear['uid'], 1)
        cursor.execute(sql)
        if cursor.rowcount > 0:
            sql = "UPDATE checkout SET member_name='%s', member_uid=%d, date_due='%s' officer_out='%s' WHERE gear_uid=%d" % (post_body['member'], member_uid, sql_datetime, officer_name, gear['uid'])
            cursor.execute(sql)
            rds_db.commit()
            already_checked_out.append(gear)
        else:
            not_checked_out.append(gear)


    for gear in not_checked_out:
        sql = "INSERT INTO checkout (gear_uid, checkout_status, member_name, member_uid, date_due, officer_out) VALUES (%d, %d, '%s', %d, '%s', '%s');" % (gear['uid'], 1, post_body['member'], member_uid, sql_datetime, officer_name)
        cursor.execute(sql)
        sql = "UPDATE gear SET status_level = 1 WHERE uid=%d" % (gear['uid'])
        cursor.execute(sql)

    rds_db.commit()
    rds_db.close()

    # TODO: Something with this message.
    post_body['status'] = "Success!"
    post_body['not_checked_out'] = not_checked_out
    post_body['already_checked_out'] = already_checked_out
    return jsonify(post_body)


@app.route("/user/<uid>")
# @authenticated_required
def get_user_contact_information_by_uid(uid):
    db = _setup_database_connection('ODC')
    cursor = db.cursor(MySQLdb.cursors.DictCursor)
    sql = "SELECT m_member.c_full_name, m_member.c_email, m_phone_number.c_phone_number FROM m_member LEFT JOIN m_phone_number ON m_member.c_uid = m_phone_number.c_uid WHERE m_phone_number.c_uid='%s'" % uid
    cursor.execute(sql)
    data = cursor.fetchone()

    return jsonify(data)

@app.route("/gear/checkin", methods=['POST'])
@authenticated_required
def check_in_gear():
    post_body = request.get_json()

    aws_db = _setup_database_connection('AWS')
    aws_cursor = aws_db.cursor(MySQLdb.cursors.DictCursor)

    old_datetime = (post_body['date_checked_in'] + ':00')
    sql_datetime = old_datetime.replace('T', ' ')

    # Get officer name
    token = post_body['authorization']
    sql = "SELECT userid FROM authenticator WHERE token='%s'" % (token)
    aws_cursor.execute(sql)
    officer_uid = aws_cursor.fetchone()['userid']

    odc_db = _setup_database_connection('ODC')
    odc_cursor = odc_db.cursor(MySQLdb.cursors.DictCursor)
    sql = "SELECT * FROM m_member WHERE c_uid=%d" % (officer_uid)
    odc_cursor.execute(sql)
    officer_name = odc_cursor.fetchone()['c_full_name']
    odc_db.close()

    count = 0
    for gear in post_body['gear']:
        sql = "SELECT * FROM gear WHERE uid=%d" % (gear['uid'])
        aws_cursor.execute(sql)
        if aws_cursor.fetchone()['status_level'] == 1:
            sql = "UPDATE gear SET status_level = 0 WHERE uid=%d" % (gear['uid'])
            aws_cursor.execute(sql)
            aws_db.commit()
            sql = "UPDATE checkout SET checkout_status=0, date_checked_in='%s', officer_in='%s' WHERE gear_uid=%d" % (sql_datetime, officer_name, gear['uid'])
            aws_cursor.execute(sql)
            aws_db.commit()
            count = count + 1

    aws_db.close()
    return jsonify({'status': 'Success!', 'count': count})

@app.route("/gear/edit", methods=['POST'])
@authenticated_required
def edit_gear():
    post_body = request.get_json()
    db = _setup_database_connection('AWS')
    cursor = db.cursor(MySQLdb.cursors.DictCursor)

    if (post_body['column'] == 'number'):
        sql = "UPDATE gear SET %s = %d WHERE uid=%d" % (post_body['column'], int(post_body['input_data']), post_body['gear_uid'])
    else:
        sql = "UPDATE gear SET %s = '%s' WHERE uid=%d" % (post_body['column'], post_body['input_data'], post_body['gear_uid'])

    cursor.execute(sql)
    db.commit()

    return jsonify({'status': 'Success!'})


@app.route("/get_active_members")
def get_active_members():
    db = _setup_database_connection('ODC')
    cursor = db.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute(
        'SELECT m_member.c_uid, c_full_name, c_email FROM m_member, m_membership WHERE m_membership.c_member = m_member.c_uid and m_member.c_deleted < 1 and m_membership.c_begin_date <= current_date and m_membership.c_expiration_date >= current_date and m_membership.c_expiration_date != \'2020-12-31\' and m_membership.c_deleted < 1 order by m_member.c_last_name, m_member.c_first_name;')
    data = cursor.fetchall()
    db.close()

    return jsonify(data)


def _setup_database_connection(database):
    db = MySQLdb.connect(os.environ[database + '_DB_HOST'], os.environ[database + '_DB_USER'], os.environ[database + '_DB_PASS'],
                         os.environ[database + '_DB_DATABASE'])
    return db


if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=True, port=80)
