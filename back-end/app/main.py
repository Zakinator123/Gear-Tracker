from flask import Flask
import MySQLdb
import MySQLdb.cursors
from flask import jsonify
import os
from flask_cors import CORS
from flask import request
import hmac
import random
from functools import wraps
import requests
from jose import jwt

app = Flask(__name__)
CORS(app)

#######################


AUTH_DOMAIN = 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_i92prdhXi'
API_AUDIENCE = 'gear-tracker'
ALGORITHMS = ["RS256"]

# Error handler
class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code

@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

# Format error response and append status code
def get_token_auth_header():
    """Obtains the Access Token from the Authorization Header
    """
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                        "description":
                            "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must start with"
                            " Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                        "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must be"
                            " Bearer token"}, 401)

    token = parts[1]
    return token

def requires_authorization(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        r = requests.get(AUTH_DOMAIN+"/.well-known/jwks.json")
        jwks = r.json()
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=API_AUDIENCE,
                    issuer=AUTH_DOMAIN
                )
            except jwt.ExpiredSignatureError:
                raise AuthError({"code": "token_expired",
                                "description": "token is expired"}, 401)
            except jwt.JWTClaimsError:
                raise AuthError({"code": "invalid_claims",
                                "description":
                                    "incorrect claims,"
                                    "please check the audience and issuer"}, 401)
            except Exception:
                raise AuthError({"code": "invalid_header",
                                "description":
                                    "Unable to parse authentication"
                                    " token."}, 401)

            return f(*args, **kwargs)
        raise AuthError({"code": "invalid_header",
                        "description": "Unable to find appropriate key"}, 401)
    return decorated


def has_scope(required_scope):
    token = get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)
    if unverified_claims.get("cognito:groups"):
            token_scopes = unverified_claims["cognito:groups"]
            for token_scope in token_scopes:
                if token_scope == required_scope:
                    return True
    return False

def read_access_required(f):
    @wraps(f)
    def check_read_scope(*args, **kwargs):
        if has_scope("Read-Access") is True or has_scope("Read-Write-Access") is True:
            return f(*args, **kwargs)
        else:
            return jsonify({'Status': 'Error', 'message': 'Missing Scopes'})
    return check_read_scope

def read_and_write_access_required(f):
    @wraps(f)
    def check_read_scope(*args, **kwargs):
        if has_scope("Read-Write-Access") is True:
            return f(*args, **kwargs)
        else:
            return jsonify({'Status': 'Error', 'message': 'Missing Scopes'})
    return check_read_scope

#######################

@app.route("/")
@requires_authorization
@read_and_write_access_required
def home():
    return ("The Gear-App API is alive and well!!!")


##############################

# No Authentication Required #

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

@app.route("/item_type/all")
def get_item_types():
    db = _setup_database_connection('AWS')
    cursor = db.cursor()

    cursor.execute("SELECT DISTINCT item FROM gear")
    data = cursor.fetchall()

    list = []
    for row in data:
        list.append(row[0])
    db.close()
    return jsonify(list)

@app.route("/condition/all")
def get_condition_types():
    db = _setup_database_connection('AWS')
    cursor = db.cursor()

    cursor.execute("SELECT DISTINCT condition_level FROM gear")
    data = cursor.fetchall()
    list = []
    for row in data:
        list.append(row[0])
    db.close()
    return jsonify(list)

@app.route("/get_unused_number")
def get_unused_gear_number():
    db = _setup_database_connection('AWS')
    cursor = db.cursor()

    while(True):
        random_num = random.randrange(3000, 20000, 1)
        sql = "SELECT number FROM gear WHERE number='%d'" % random_num
        cursor.execute(sql)
        if cursor.rowcount == 0:
            db.close()
            break

    return jsonify([random_num])

##############################

# Authentication and Read-Access Required #

@app.route("/checkout/current")
@requires_authorization
@read_access_required
def get_current_checkouts():
    db = _setup_database_connection('AWS')
    cursor = db.cursor(MySQLdb.cursors.DictCursor)

    cursor.execute(
        "SELECT DATE_FORMAT(checkout.date_checked_out,'%m/%d/%Y') AS date_checked_out , DATE_FORMAT(checkout.date_due,'%m/%d/%Y') AS date_due, checkout.checkout_id, checkout.gear_uid, checkout.officer_out, checkout.member_name, checkout.member_uid, gear.number, gear.item, gear.description, gear.status_level FROM checkout LEFT JOIN gear ON checkout.gear_uid = gear.uid WHERE gear.status_level=1 AND checkout.checkout_status=1")
    data = cursor.fetchall()
    db.close()
    return jsonify(data)

@app.route("/checkout/past")
@requires_authorization
@read_access_required
def get_past_checkouts():
    db = _setup_database_connection('AWS')
    cursor = db.cursor(MySQLdb.cursors.DictCursor)

    cursor.execute(
        "SELECT DATE_FORMAT(checkout.date_checked_out,'%m/%d/%Y') AS date_checked_out , DATE_FORMAT(checkout.date_due,'%m/%d/%Y') AS date_due, DATE_FORMAT(checkout.date_checked_in,'%m/%d/%Y') AS date_checked_in, checkout.checkout_id, checkout.gear_uid, checkout.officer_out, checkout.officer_in, checkout.member_name, checkout.member_uid, gear.number, gear.item, gear.description, gear.status_level FROM checkout LEFT JOIN gear ON checkout.gear_uid = gear.uid WHERE checkout.checkout_status=0")
    data = cursor.fetchall()
    db.close()
    return jsonify(data)


@app.route("/gear/checkout", methods=['POST'])
@requires_authorization
@read_and_write_access_required
def checkout_gear():
    post_body = request.get_json()

    officer_name = post_body['officerName']

    rds_db = _setup_database_connection('AWS')
    odc_db = _setup_database_connection('ODC')

    cursor = odc_db.cursor(MySQLdb.cursors.DictCursor)
    sql = "SELECT * FROM m_member WHERE c_email='%s'" % (post_body['memberEmail'])
    cursor.execute(sql)
    member_uid = cursor.fetchone()['c_uid']
    odc_db.close()
    cursor = rds_db.cursor(MySQLdb.cursors.DictCursor)

    old_datetime = (post_body['dueDate'] + ':00')
    sql_datetime = old_datetime.replace('T', ' ')

    not_checked_out = []
    already_checked_out = []
    for gear in post_body['gear']:
        sql = "SELECT * FROM checkout WHERE gear_uid=%d AND checkout_status=1" % (gear['uid'])
        cursor.execute(sql)
        if cursor.rowcount > 0:
            sql = "UPDATE checkout SET member_name='%s', member_uid=%d, date_due='%s', officer_out='%s' WHERE gear_uid=%d AND checkout_status=1;" % (post_body['member'], member_uid, sql_datetime, officer_name, gear['uid'])
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


@app.route("/gear/accession", methods=['POST'])
@requires_authorization
@read_and_write_access_required
def accession_gear():
    post_body = request.get_json()['gear']

    rds_db = _setup_database_connection('AWS')
    cursor = rds_db.cursor(MySQLdb.cursors.DictCursor)

    sql = "INSERT INTO gear (number, item, condition_level, status_level, description, notes) VALUES (%d, '%s', %d, %d, '%s', '%s');" % (int(post_body['number']), post_body['itemType'], post_body['itemCondition'], 0, post_body['description'], post_body['notes'])

    cursor.execute(sql)
    rds_db.commit()
    rds_db.close()
    post_body['status'] = "Success!"
    return jsonify(post_body)

@app.route("/users/new", methods=['POST'])
@requires_authorization
@read_and_write_access_required
def add_user():
    post_body = request.get_json()['member_information']

    rds_db = _setup_database_connection('ODC')
    cursor = rds_db.cursor(MySQLdb.cursors.DictCursor)

    # Overwrite existing user's information if email exists since emails are unique.
    sql = "SELECT c_uid FROM m_member WHERE c_email='%s'" % post_body['member_email']
    cursor.execute(sql)
    if cursor.rowcount != 0:
        uid = cursor.fetchone()['c_uid']
        sql = "UPDATE m_member SET c_full_name='%s' WHERE c_email='%s'" % (post_body['member_name'], post_body['member_email'])
        cursor.execute(sql)
        sql = "UPDATE m_membership SET c_expiration_date='%s' WHERE c_member=%d" % ('2017-9-1', uid)
        cursor.execute(sql)
        sql = "UPDATE m_phone_number SET c_phone_number='%s' WHERE c_owner=%d" % (post_body['member_phone_number'], uid)
        cursor.execute(sql)
        rds_db.commit()
        rds_db.close()
        post_body['status'] = "Success!"
        post_body['message'] = "This email associated with this member already existed in the database, so their name and phonenumber was overwritten!"
        return jsonify(post_body)
    else:
        while(True):
            random_num = random.randrange(10000, 100000, 1)
            sql = "SELECT c_uid FROM m_member WHERE c_uid='%d'" % random_num
            cursor.execute(sql)
            if cursor.rowcount == 0:
                break

        sql = "INSERT INTO m_member (c_uid, c_full_name, c_email, c_deleted) VALUES (%d, '%s', '%s', %d)" % (random_num, post_body['member_name'], post_body['member_email'], 0)
        cursor.execute(sql)
        sql = "INSERT INTO m_membership (c_member,  c_expiration_date, c_begin_date) VALUES (%d, '%s', '%s')" % (random_num, '2017-9-1', '2004-03-15')
        cursor.execute(sql)
        sql = "INSERT INTO m_phone_number (c_owner, c_phone_number) VALUES (%d, '%s')" % (random_num, post_body['member_phone_number'])
        cursor.execute(sql)

        rds_db.commit()
        rds_db.close()
        post_body['status'] = "Success!"
        post_body['message'] = "Successfully saved member's information!"
        return jsonify(post_body)

@app.route("/user/<uid>")
@requires_authorization
@read_access_required
def get_user_contact_information_by_uid(uid):
    db = _setup_database_connection('ODC')
    cursor = db.cursor(MySQLdb.cursors.DictCursor)
    sql = "SELECT m_member.c_full_name, m_member.c_email, m_phone_number.c_phone_number FROM m_member LEFT JOIN m_phone_number ON m_member.c_uid = m_phone_number.c_owner WHERE m_phone_number.c_owner='%s'" % uid
    cursor.execute(sql)
    data = cursor.fetchone()

    return jsonify(data)

@app.route("/gear/checkin", methods=['POST'])
@requires_authorization
@read_and_write_access_required
def check_in_gear():
    post_body = request.get_json()

    aws_db = _setup_database_connection('AWS')
    aws_cursor = aws_db.cursor(MySQLdb.cursors.DictCursor)

    old_datetime = (post_body['date_checked_in'] + ':00')
    sql_datetime = old_datetime.replace('T', ' ')

    officer_name = post_body['officerName']

    count = 0
    for gear in post_body['gear']:
        sql = "SELECT * FROM gear WHERE uid=%d" % (gear['uid'])
        aws_cursor.execute(sql)
        if aws_cursor.fetchone()['status_level'] == 1:
            sql = "UPDATE gear SET status_level = 0 WHERE uid=%d" % (gear['uid'])
            aws_cursor.execute(sql)
            aws_db.commit()
            sql = "UPDATE checkout SET checkout_status=0, date_checked_in='%s', officer_in='%s' WHERE gear_uid=%d AND checkout_status=1" % (sql_datetime, officer_name, gear['uid'])
            aws_cursor.execute(sql)
            aws_db.commit()
            count = count + 1

    aws_db.close()
    return jsonify({'status': 'Success!', 'count': count})

@app.route("/gear/edit", methods=['POST'])
@requires_authorization
@read_and_write_access_required
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
@requires_authorization
@read_access_required
def get_active_members():
    db = _setup_database_connection('ODC')
    cursor = db.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute(
        'SELECT m_member.c_uid, c_full_name, c_email FROM m_member, m_membership WHERE m_membership.c_member = m_member.c_uid and m_member.c_deleted < 1 and m_membership.c_begin_date <= current_date and m_membership.c_expiration_date >= "2017-9-1" and m_membership.c_deleted < 1 group by m_member.c_email order by m_member.c_last_name, m_member.c_first_name;')
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
