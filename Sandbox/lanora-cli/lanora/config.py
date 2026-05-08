import os
import json

CONFIG_DIR = os.path.expanduser("~/.lanora")
CONFIG_PATH = os.path.join(CONFIG_DIR, "config.json")

def save_session(token, email=None):
    os.makedirs(CONFIG_DIR, exist_ok = True)

    data = {                       # the token stores  
        "token": token
    }
    
    if email:                           # the new part 
        data["user"] = {
            "email":email
        }

    with open(CONFIG_PATH, "w") as f:
        json.dump(data, f)

def load_session():
    if not os.path.exists(CONFIG_PATH):
        return None
    
    try:
        with open(CONFIG_PATH, "r") as f:
            return json.load(f)
    except:
        return None

def get_token():
    data = load_session()
    if data:
        return data.get("token")
    return None

def get_user():                     # the new part added of user details
    data = load_session()
    if data and "user" in data:
        return data["user"]
    return None


def is_logged_in():
    return get_token() is not None


def clear_session():
    if os.path.exists(CONFIG_PATH):
        os.remove(CONFIG_PATH)
