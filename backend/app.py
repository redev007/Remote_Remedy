import datetime
import uuid
from flask import Flask, request, Response, redirect, render_template, send_from_directory, jsonify, url_for
import secrets
import stripe
from flask_mail import Mail, Message
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, JWTManager
from flask_cors import CORS
import pymongo
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
import json
from threading import Thread
import requests
import pickle
import numpy as np
import pandas as pd

load_dotenv()
secret_key = secrets.token_hex(16)

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = secret_key
SECRET_KEY = os.getenv('SECRET')


app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = os.getenv('PORT')
app.config['MAIL_USERNAME'] = os.getenv('HOST_EMAIL')
app.config['MAIL_PASSWORD'] = os.getenv('PASSWORD')
app.config['MAIL_USE_TLS'] = True
mail = Mail(app)

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
jwt = JWTManager(app)

CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)

URI = os.getenv("DBURL")
TOKEN = os.getenv("WHATSAPP")

client = pymongo.MongoClient(URI, server_api=ServerApi('1'))


doctor = client.get_database("Remote_Remedy").doctors
patients = client.get_database("Remote_Remedy").patients
feedback = client.get_database("Remote_Remedy").feedback

YOUR_DOMAIN = os.getenv('DOMAIN') 


# Test MongoDB connection
try:
    client.admin.command('ping')
    print("MongoDB connection successful!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
@app.get("/")
def getInfo():
    return "API WORKING"

@app.before_request
def before_request():
    if request.method == 'OPTIONS':
        return Response()

def whatsapp_message(msg):
    reqUrl = "https://graph.facebook.com/v16.0/100184439766915/messages"
    headersList = {
     "Accept": "*/*",
     "Authorization": "Bearer {TOKEN}",
     "Content-Type": "application/json" 
    }
    payload = json.dumps(msg)
    response = requests.request("POST", reqUrl, data=payload,  headers=headersList)
    print(response)

# ----------- stripe payment routes -----------------

@app.route('/checkout')
def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items = [
                {   
                    "price": "price_1MxPc3SAmG5gMbbMjAeavhpb",
                    "quantity": 1
                }
            ],
            mode="payment",
            success_url=YOUR_DOMAIN + "success",
            cancel_url = YOUR_DOMAIN + "failed"
        )
    except Exception as e:
        return str(e)
 
    return jsonify({'url': checkout_session.url})

@app.route('/create-payment-intent', methods=['POST'])
def create_payment():
    try:
        data = json.loads(request.data)
        print(data)
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=data['amount'],
            currency='inr',
            payment_method_types=['card'],
        )
        return jsonify({
            'clientSecret': intent['client_secret']
        })
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 403

# # ----------- Authentication routes ----------------
# 
@app.route('/register', methods=['POST'])
def register():
    if request.is_json:
        data = request.get_json()
        if data['registerer'] == 'patient':
            if doctor.find_one({'email': data['email']}):
                return jsonify({'message': 'User already exists'}), 400
            user = patients.find_one({'email': data['email']})
            if user:
                return jsonify({'message': 'User already exists'}), 400
            else:
                hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
                data['passwd'] = hashed_password
                data['upcomingAppointments'] = []
                if 'specialization' in data:
                    del data['specialization']
                patients.insert_one(data)
                payload = {
                      "messaging_product": "whatsapp",
                      "to": data['phone'],
                      "text": {
                        "body": "Thank You for Signing up on Remote_Remedy"
                    }
                }
                whatsapp_message(payload)

                return jsonify({'message': 'User created successfully'}), 200
        elif data['registerer'] == 'doctor':
            if patients.find_one({'email': data['email']}):
                return jsonify({'message': 'User already exists'}), 400
            user = doctor.find_one({'email': data['email']})
            if user:
                return jsonify({'message': 'User already exists'}), 400
            else:
                hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
                data['passwd'] = hashed_password
                data['meet'] = False
                data['appointments'] = 0
                data['stars'] = 0
                data["status"] = "offline"
                data['upcomingAppointments'] = []
                if 'age' in data:
                    del data["age"]
                doctor.insert_one(data)
                return jsonify({'message': 'User created successfully'}), 200
        else:
            return jsonify({'message': 'Invalid registerAs'}), 400
    else:
        return jsonify({'message': 'Invalid request'}), 400

@app.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    data = request.get_json()
    var = patients.find_one({'email': data['email']})
    if var:
        if bcrypt.check_password_hash(var['passwd'], data['passwd']):
            access_token = create_access_token(identity=data['email'])
            # token = access_token.decode('utf-8')
            return jsonify({'message': 'User logged in successfully', 'access_token': access_token, "username": var["username"], "usertype": "patient", "gender": var["gender"], "phone": var["phone"], "age": var["age"]}), 200
        else:
            return jsonify({'message': 'Invalid password'}), 400
    else:
        doctor.update_one({'email': data['email']}, {'$set': {'status': 'online'}})
        var = doctor.find_one({'email': data['email']})
        if var:
            if bcrypt.check_password_hash(var['passwd'], data['passwd']):
                access_token = create_access_token(identity=data['email'])
                # token = access_token.decode('utf-8')
                return jsonify({'message': 'User logged in successfully', 'access_token': access_token, "username": var["username"], "usertype": "doctor", "gender": var["gender"], "phone": var["phone"], "specialization": var["specialization"], "meet": var["meet"], "verified": var.get("verified", False)}), 200
            else:
                return jsonify({'message': 'Invalid password'}), 400
        else:
            return jsonify({'message': 'Invalid username or password'}), 401
        
@app.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    email = data['email']
    
    # Find the document with the given email
    var = doctor.find_one({'email': email})
    
    if var:
        # If the document exists, check if 'verified' field exists
        if 'verified' not in var:
            # If 'verified' field doesn't exist, add it and set to True
            doctor.update_one({'email': email}, {'$set': {'verified': True}})
        else:
            # If 'verified' exists, just ensure it's set to True
            doctor.update_one({'email': email}, {'$set': {'verified': True}})
        
        verified = True  # Since we just set it to True
    else:
        verified = False  # If the document doesn't exist, treat as unverified
    
    return jsonify({'message': 'verification details', "verified": verified}), 200

@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    print(data)
    email = data['email']
    print(email)
    
    user = patients.find_one({'email': email}) or doctor.find_one({'email': email})
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Generate a password reset token
    token = secrets.token_urlsafe(16)

    # Store the token in the user's document with an expiration time
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    patients.update_one({'email': email}, {'$set': {'reset_token': token, 'reset_token_expiration': expiration_time}})
    doctor.update_one({'email': email}, {'$set': {'reset_token': token, 'reset_token_expiration': expiration_time}})

    # Send the token to the user's email
    reset_url = url_for('reset_password', token=token, _external=True)
    msg = Message("Password Reset Request",
                    sender=os.getenv('HOST_EMAIL'),
                    recipients=[email])
    msg.body = f"To reset your password, visit the following link: {reset_url}"
    mail.send(msg)

    return jsonify({'message': 'Password reset link sent'}), 200


@app.route('/reset_password/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json()
    new_password = data['password']
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    # Find the user with the token and check if it's still valid
    user = patients.find_one({'reset_token': token, 'reset_token_expiration': {'$gt': datetime.datetime.utcnow()}}) or \
           doctor.find_one({'reset_token': token, 'reset_token_expiration': {'$gt': datetime.datetime.utcnow()}})
    
    if not user:
        return jsonify({'message': 'The reset link is invalid or has expired'}), 400

    # Update the user's password and remove the reset token
    patients.update_one({'reset_token': token}, {'$set': {'passwd': hashed_password}, '$unset': {'reset_token': "", 'reset_token_expiration': ""}})
    doctor.update_one({'reset_token': token}, {'$set': {'passwd': hashed_password}, '$unset': {'reset_token': "", 'reset_token_expiration': ""}})

    return jsonify({'message': 'Password has been reset'}), 200

        
@app.route('/doc_status', methods=['PUT'])
def doc_status():
    data = request.get_json()
    user = data['email']
    doctor.update_one({'email': user}, {'$set': {'status': 'offline'}})
    return jsonify({'message': 'Doctor status updated successfully'}), 200



# @app.route('/meet_end', methods=['PUT'])
# def meet_end():
#     data = request.get_json()
#     user = data['email']
#     doctor.update_one({'email': user}, {'$set': {'meet': False}})
#     return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route('/get_status', methods=['GET'])
def get_status():
    details = []
    count = 0
    for i in doctor.find():
        if i.get('verified', False):
            count += 1
            details.append({"email": i["email"], "status": i.get("status", "offline"), "username": i["username"], "specialization": i["specialization"], "gender": i["gender"], "phone": i["phone"], "isInMeet": i["meet"], "noOfAppointments": i["appointments"], "noOfStars": i["stars"], "id": count, 'fee': i.get('fee', 199)})
    # print(details)
    return jsonify({"details": details}), 200

def send_message_async(msg):
    with app.app_context():
        mail.send(msg)
        # os.remove(os.path.join(app.root_path, 'upload', 'Receipt.pdf'))

@app.get('/media/<path:path>')
def send_media(path):
    return send_from_directory(
        directory='upload', path=path
    )

@app.route('/mail_file', methods=['POST'])
def mail_file():
    # get form data
    user = request.form.get("email")
    f = request.files['file']
    f.save(os.path.join(app.root_path, 'upload', 'Receipt.pdf'))
    msg = Message("Receipt cum Prescription for your Consultancy",
                  sender="deexithmadas277@gmail.com",
                  recipients=[user])
    pat = patients.find_one({'email': user})
    msg.html = render_template('email.html', Name=pat['username'] )
    payload = {
          "messaging_product": "whatsapp",
          "to": pat['phone'],
          "type": "document",
          "document": {
            "filename": "Receipt.pdf",
            "link" : "http://34.93.183.254/media/Receipt.pdf",
          }
        }
    whatsapp_message(payload)

    with app.open_resource(os.path.join(app.root_path, 'upload', 'Receipt.pdf')) as fp:
        msg.attach("Receipt.pdf", "application/pdf", fp.read())
    thread = Thread(target=send_message_async, args=(msg,))
    thread.start()
    return jsonify({"message": "Sucess"}), 200

# ----------- appointment routes -----------------

@app.route('/doctor_app', methods=['POST'])
def doctor_app():
    data = request.get_json()
    email = data['email']
    doctor.update_one({'email': email}, {'$inc': {'appointments': 1, 'stars': data['stars']}})
    return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route('/set_appointment', methods=['POST', 'PUT'])
def set_appointment():
    data = request.get_json()
    email = data['email']
    doc = doctor.find_one({'email': email})
    if request.method == 'POST':
        return jsonify({'message': 'Doctor Appointments', 'appointments': doc['upcomingAppointments']}), 200
    else:
        doc['upcomingAppointments'].append({
            "date": data['date'],
            "time": data['time'],
            "patient": data['patient'],
            "pemail": data['pemail'],
            "link": data['link'],
        })

        pat = patients.find_one({'email': data['pemail']})
        payload = {
                "messaging_product": "whatsapp",
                "to": pat['phone'],
                "text": {
                "body": "Your Appointment has been booked on " + data['date'] + " at "+ data['time'] + " with Dr." + doc['username'] +"."
            }
        }
        whatsapp_message(payload)

        doctor.update_one({'email': email}, {'$set': {'upcomingAppointments': doc['upcomingAppointments']}})
        return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route('/patient_apo', methods=['POST', 'PUT'])
def patient_apo():
    data = request.get_json()
    email = data['email']
    pat = patients.find_one({'email': email})

    if request.method == 'POST':
        return jsonify({'message': 'Patient Appointments', 'appointments': pat['upcomingAppointments']}), 200
    else:
        pat['upcomingAppointments'].append({
            "date": data['date'],
            "time": data['time'],
            "doctor": data['doctor'],
            "demail": data['demail'],
            "link": data['link'],
        })
        patients.update_one({'email': email}, {'$set': {'upcomingAppointments': pat['upcomingAppointments']}})
        return jsonify({'message': 'Patient status updated successfully'}), 200
    
# ----------- meeting routes -----------------

@app.route('/make_meet', methods=['POST', 'PUT'])
def make_meet():
    data = request.get_json()
    email = data['email']
    if request.method == 'PUT':
        print(data['link'])
        doctor.update_one({'email': email}, {'$set': {'link': {'link': data['link'], "name": data['patient']}}})
        return jsonify({'message': 'Meet link created successfully'}), 200
    else:
        doc = doctor.find_one({'email': email})
        return jsonify({'message': 'Meet link', 'link': doc.get('link', None)}), 200
    
@app.route('/meet_status', methods=['POST'])
def meet_status():
    data = request.get_json()
    user = data['email']
    details = doctor.find_one({'email': user})
    if details['meet'] == True:
        return jsonify({'message': 'Doctor is already in a meet', 'link': details.get('link', '')}), 208
    else:
        if data.get('link', '') == '':
            doctor.update_one({'email': user}, {'$set': {'meet': True}})
        else:
            doctor.update_one({'email': user}, {'$set': {'meet': True, 'link': data['link']}})
        return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route('/delete_meet', methods=['PUT'])
def delete_meet():
    data = request.get_json()
    email = data['email']
    doctor.update_one({'email': email}, {'$unset': {'link': None, 'currentlyInMeet': None}})
    doctor.update_one({'email': email}, {'$set': {'meet': False}})

    return jsonify({'message': 'Meet link deleted successfully'}), 200

@app.route('/currently_in_meet', methods=['POST', 'PUT'])
def currently_in_meet():
    data = request.get_json()
    email = data['email']
    if request.method == 'PUT':
        doctor.update_one({'email': email}, {'$set': {'currentlyInMeet': True}})
        return jsonify({'message': 'Currently in meet'}), 200
    else:
        doc = doctor.find_one({'email': email})
        return jsonify({'message': 'Currently in meet', 'curmeet': doc.get('currentlyInMeet', False)}), 200
    
# @app.route('/delete_currently_in_meet', methods=['PUT'])
# def delete_currently_in_meet():
#     data = request.get_json()
#     email = data['email']
#     return jsonify({'message': 'Not Currently in meet'}), 200
    
@app.route("/doctor_avilability", methods=['PUT'])
def doctor_avilability():
    data = request.get_json()
    user = data['email']
    doctor.update_one({'email': user}, {'$set': {'status': 'online'}})
    return jsonify({'message': 'Doctor status updated successfully'}), 200

# ----------- orders routes -----------------
@app.route("/add_order", methods=['POST'])
def add_order():
    data = request.get_json()
    email = data['email']
    print(data)
    var = patients.find_one({'email': email})
    if var:
        orders = var.get('orders', [])
        for i in data["orders"]:
            i['key'] = str(uuid.uuid4())
            i['Ordered_on'] = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            orders.append(i)
        patients.update_one({'email': email}, {'$set': {'orders': orders}})
        return jsonify({'message': 'Order added successfully'}), 200
    else:
        var = doctor.find_one({"email":email})
        orders = var.get('orders', [])
        for i in data["orders"]:
            i['key'] = str(uuid.uuid4())
            i['Ordered_on'] = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            orders.append(i)
        doctor.update_one({'email': email}, {'$set': {'orders': orders}})
        return jsonify({'message': 'Order added successfully'}), 200
    
@app.route("/get_orders", methods=['POST'])
def get_orders():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email':email})
    if var:
        return jsonify({'message': 'Orders', 'orders': var['orders']}), 200
    else:
        var = doctor.find_one({'email': email})
        return jsonify({'message': 'Orders', 'orders': var['orders']}), 200

@app.route('/update_details', methods=['PUT'])
def update_details():
    data = request.get_json()
    usertype = data['usertype']
    email = data['email']
    if usertype == 'doctor':
        if data['passwd'] == '':
            doctor.update_one({'email': email}, {'$set': {'username': data['username'], 'phone': data['phone'], 'specialization': data['specialization'], 'gender': data['gender'], 'fee': data['fee']}})
        else:
            hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
            data['passwd'] = hashed_password
            doctor.update_one({'email': email}, {'$set': {'username': data['username'], 'phone': data['phone'], 'specialization': data['specialization'], 'passwd': data['passwd'], 'gender': data['gender'], 'fee': data['fee']}})
        return jsonify({'message': 'Doctor details updated successfully'}), 200
    else:
        if data['passwd'] == '':
            patients.update_one({'email': email}, {'$set': {'username': data['username'], 'phone': data['phone'], 'age': data['age'], 'gender': data['gender']}})
        else:
            hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
            data['passwd'] = hashed_password
            patients.update_one({'email': email}, {'$set': {'username': data['username'], 'phone': data['phone'],  'passwd': data['passwd'], 'age': data['age'], 'gender': data['gender']}})
        return jsonify({'message': 'Patient details updated successfully'}), 200

# ----------- cart routes -----------------

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        cart = var.get('cart', [])
        for i in data["cart"]:
            for j in cart:
                if j['id'] == i['id']:
                    j['quantity'] = i['quantity']
                    break
            else:
                i['key'] = str(uuid.uuid4())
                cart.append(i)
        patients.update_one({'email': email}, {'$set': {'cart': cart}})
        return jsonify({'message': 'Cart added successfully', 'cart': cart}), 200
    else:
        var = doctor.find_one({"email":email})
        cart = var.get('cart', [])
        for i in data["cart"]:
            for j in cart:
                if j['id'] == i['id']:
                    j['quantity'] = i['quantity']
                    break
            else:
                i['key'] = str(uuid.uuid4())
                cart.append(i)
        doctor.update_one({'email': email}, {'$set': {'cart': cart}})
        return jsonify({'message': 'Cart added successfully', 'cart': cart}), 200
    
@app.route("/get_cart", methods=['POST'])
def get_cart():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email':email})
    if var:
        return jsonify({'message': 'Cart', 'cart': var.get('cart', [])}), 200
    else:
        var = doctor.find_one({'email': email})
        return jsonify({'message': 'Cart', 'cart': var.get('cart', [])}), 200

@app.route('/increase_quantity', methods=['POST'])
def increase_quantity():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        for i in var['cart']:
            if i['id'] == data['id']:
                i['quantity'] += 1
                break
        patients.update_one({'email': email}, {'$set': {'cart': var['cart']}})
        return jsonify({'message': 'Quantity increased successfully'}), 200
    else:
        var = doctor.find_one({'email': email})
        for i in var['cart']:
            if i['id'] == data['id']:
                i['quantity'] += 1
                break
        doctor.update_one({'email': email}, {'$set': {'cart': var['cart']}})
        return jsonify({'message': 'Quantity increased successfully'}), 200
    
@app.route('/decrease_quantity', methods=['POST'])
def decrease_quantity():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        for i in var['cart']:
            if i['id'] == data['id']:
                i['quantity'] -= 1
                break
        patients.update_one({'email': email}, {'$set': {'cart': var['cart']}})
        return jsonify({'message': 'Quantity increased successfully'}), 200
    else:
        var = doctor.find_one({'email': email})
        for i in var['cart']:
            if i['id'] == data['id']:
                i['quantity'] -= 1
                break
        doctor.update_one({'email': email}, {'$set': {'cart': var['cart']}})
        return jsonify({'message': 'Quantity increased successfully'}), 200
    
@app.route("/delete_cart", methods=['POST'])
def delete_cart():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email':email})
    if var:
        cart = var['cart']
        for i in var['cart']:
            if i['id'] == data['id']:
                cart.remove(i)
        patients.update_one({'email': email}, {'$set': {'cart': cart}})
        return jsonify({'message': 'Cart deleted successfully'}), 200
    else:
        var = doctor.find_one({'email': email})
        cart = var['cart']
        for i in var['cart']:
            if i['id'] == data['id']:
                cart.remove(i)
        doctor.update_one({'email': email}, {'$set': {'cart': cart}})
        return jsonify({'message': 'Cart deleted successfully'}), 200
    
@app.route("/delete_all_cart", methods=['POST'])
def delete_all_cart():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({"email": email})
    if var:
        patients.update_one({'email': email}, {'$set': {'cart': []}})
        return jsonify({'message': 'Cart deleted successfully'}), 200
    else:
        doctor.update_one({'email': email}, {'$set': {'cart': []}})
        return jsonify({'message': 'Cart deleted successfully'}), 200


# ----------- wallet routes -----------------

@app.route('/wallet', methods=['POST'])
def wallet():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        wallet = var.get('wallet', 0)+round(float(data['walletAmount']))
        patients.update_one({'email': email}, {'$set': {'wallet': wallet}})
        return jsonify({'message': 'Wallet updated successfully'}), 200
    else:
        var = doctor.find_one({'email': email})
        wallet = var.get('wallet', 0)+round(float(data['walletAmount']))
        doctor.update_one({'email': email}, {'$set': {'wallet': wallet}})
        return jsonify({'message': 'Wallet updated successfully'}), 200

@app.route('/get_wallet', methods=['POST'])
def get_wallet():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        return jsonify({'message': 'Wallet', 'wallet': var.get('wallet', 0)}), 200
    else:
        var = doctor.find_one({'email': email})
        return jsonify({'message': 'Wallet', 'wallet': var.get('wallet', 0)}), 200

@app.route("/debit_wallet", methods=['POST'])
def debit_wallet():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if data.get('demail', False):
        demail = data['demail']
        doc = doctor.find_one({'email': demail})
        wallet = var.get('wallet', 0)-round(float(doc.get('fee', 0)))
        patients.update_one({'email': email}, {'$set': {'wallet': wallet}})
        return jsonify({'message': 'Wallet updated successfully'}), 200
    else:
        if var:
            wallet = var.get('wallet', 0)-round(float(data['walletAmount']))
            patients.update_one({'email': email}, {'$set': {'wallet': wallet}})
            return jsonify({'message': 'Wallet updated successfully'}), 200
        else:
            var = doctor.find_one({'email': email})
            wallet = var.get('wallet', 0)-round(float(data['walletAmount']))
            doctor.update_one({'email': email}, {'$set': {'wallet': wallet}})
            return jsonify({'message': 'Wallet updated successfully'}), 200
    
@app.route('/add_wallet_history', methods=['POST'])
def add_wallet_history():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        history = var.get('wallet_history', [])
        history.append(data['history'])
        patients.update_one({'email': email}, {'$set': {'wallet_history': history}})
        return jsonify({'message': 'Wallet history added successfully'}), 200
    else:
        var = doctor.find_one({'email': email})
        history = var.get('wallet_history', [])
        history.append(data['history'])
        doctor.update_one({'email': email}, {'$set': {'wallet_history': history}})
        return jsonify({'message': 'Wallet history added successfully'}), 200
    
@app.route('/get_wallet_history', methods=['POST'])
def get_wallet_history():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        return jsonify({'message': 'Wallet history', 'wallet_history': var.get('wallet_history', [])}), 200
    else:
        var = doctor.find_one({'email': email})
        return jsonify({'message': 'Wallet history', 'wallet_history': var.get('wallet_history', [])}), 200

#------------ feedback route ------------------------------
@app.route('/feedback', methods=['POST'])
def save_feedback():
    data = request.get_json()
    try:
        # Saving feedback information
        feedback.insert_one(data);
        return jsonify({"message": "Feedback Saved Successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500     
        
@app.route('/feedback',methods=['GET'])
def get_all_feedback():
    try:
        feedbacks = list(feedback_collection.find({}, {"_id": 0}))
        return jsonify(feedbacks),200
    except Exception as e:
        return jsonify({"error": str(e)}), 500    

@app.route('/feedback/<id>',methods=['GET'])
def get_feedback(id):
    try:
        result = feedback.find_one({'feedbackid':id})         
        if(result):
            return jsonify({"message":"Feedback found","data":result}), 200
        else: return jsonify({"message": "Feedback Not Found"}),400    
    except Exception as e:
        return jsonify({"error": str(e)}), 500  
                       
# ----------- email for contact us routes -----------------
@app.route('/contact', methods=['POST'])
def contact():
    data = request.json
    try:
        # Send email notification
        msg = Message(
            subject=f"New Contact Form Submission: {data['subject']}",
            sender=data['email'],
            recipients=["Remote_Remedy489@gmail.com"],
            body=f"""
            New contact form submission from:
            Name: {data['name']}
            Email: {data['email']}
            Subject: {data['subject']}
            Message: {data['message']}
            """
        )
        mail.send(msg)
        return jsonify({"message": "Message sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#---------disease prediction---------------
model = pickle.load(open('./MLModel/ExtraTrees', 'rb'))
# # Get the absolute path to the MLModel folder
# model_path = os.path.join(os.path.dirname(__file__), 'MLModel', 'ExtraTrees')

# # Load the pickle file
# with open(model_path, 'rb') as file:
#     model = pickle.load(file)

diseases = [ '(vertigo) Paroymsal Positional Vertigo', 'AIDS', 'Acne', 'Alcoholic hepatitis', 'Allergy', 'Arthritis', 'Bronchial Asthma', 'Cervical spondylosis', 'Chicken pox', 'Chronic cholestasis', 'Common Cold', 'Dengue', 'Diabetes', 'Dimorphic hemmorhoids(piles)', 'Drug Reaction', 'Fungal infection', 'GERD', 'Gastroenteritis', 'Heart attack', 'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Hepatitis E', 'Hypertension', 'Hyperthyroidism', 'Hypoglycemia', 'Hypothyroidism', 'Impetigo', 'Jaundice', 'Malaria', 'Migraine', 'Osteoarthristis', 'Paralysis (brain hemorrhage)', 'Peptic ulcer diseae', 'Pneumonia', 'Psoriasis', 'Tuberculosis', 'Typhoid', 'Urinary tract infection', 'Varicose veins', 'hepatitis A' ]

symptoms = [ 'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering', 'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting', 'vomiting', 'burning_micturition', 'fatigue', 'weight_gain', 'anxiety', 'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness', 'lethargy', 'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever', 'sunken_eyes', 'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache', 'yellowish_skin', 'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain', 'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine', 'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach', 'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm', 'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs', 'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising', 'obesity', 'swollen_legs', 'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips', 'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints', 'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness', 'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 'toxiclook(typhos)', 'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body', 'belly_pain', 'abnormal_menstruation', 'watering_from_eyes', 'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum', 'rusty_sputum', 'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion', 'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'distention_of_abdomen', 'history_of_alcohol_consumption', 'blood_in_sputum', 'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples', 'blackheads', 'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails', 'blister', 'red_sore_around_nose', 'yellow_crust_ooze']

print(len(symptoms)) 
desc=pd.read_csv("./MLModel/symptom_Description.csv")
prec=pd.read_csv("./MLModel/symptom_precaution.csv") 

@app.route('/disease', methods=["GET"]) 
def home(): return app.send_static_file('DiseasePrediction.jsx')

@app.route('/predict', methods=['POST']) 
def predict():

 # Get the data from the POST request
 data = request.get_json(force=True)

 # Create a list of zeros
 features = [0]*len(symptoms)

 # Set the corresponding indices to 1 for the symptoms present in the data
 for symptom in data:
    if symptom in symptoms:
        index = symptoms.index(symptom)
        features[index] = 1

# Make prediction using the model
 proba = model.predict_proba([features])

 # Get the indices and probabilities of the top 5 classes
 top5_idx = np.argsort(proba[0])[-5:][::-1]
 top5_proba = np.sort(proba[0])[-5:][::-1]

 # Get the names of the top 5 diseases
 top5_diseases = [diseases[i] for i in top5_idx]

 # Prepare the response
 response = []
 for i in range(5):
    disease = top5_diseases[i]
    probability = top5_proba[i]

    # Get the disease description
    disp = desc[desc['Disease'] == disease].values[0][1] if disease in desc["Disease"].unique() else "No description available"

    # Get the precautions
    precautions = []
    if disease in prec["Disease"].unique():
        c = np.where(prec['Disease'] == disease)[0][0]
        for j in range(1, len(prec.iloc[c])):
            precautions.append(prec.iloc[c, j])

    # Add the disease prediction to the response
    response.append({
        'disease': disease,
        'probability': float(probability),
        'description': disp,
        'precautions': precautions
    })

 # Send back to the client
 return jsonify(response)

