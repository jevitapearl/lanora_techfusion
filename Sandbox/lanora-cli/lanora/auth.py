import requests
import webbrowser
from lanora.config import save_session, clear_session

API_URL = "http://localhost:5000"


def register():
    print("Opening browser for registration...")
    webbrowser.open("http://localhost:5173/register")


def login():
    email = input("Enter your email: ").strip()
    password = input("Enter your password: ").strip()

    try:
        res = requests.post(
            f"{API_URL}/login",
            json={
                "email": email,
                "password": password
            },
            timeout=10
        )

        # Debug output
        print("STATUS:", res.status_code)
        print("RAW RESPONSE:", res.text)

        # Handle backend errors first
        if res.status_code != 200:
            print(f"Login failed: {res.text}")
            return

        # Safely parse JSON
        try:
            data = res.json()
        except ValueError:
            print("Server did not return valid JSON.")
            return

        token = data.get("token")

        if not token:
            print("No token received from server.")
            return

        # Save token locally
        save_session(token, email)

        print("Logged in successfully.")

    except requests.exceptions.ConnectionError:
        print("Cannot connect to backend. Is server running?")

    except requests.exceptions.Timeout:
        print("Request timed out.")

    except Exception as e:
        print("Error:", e)


def logout():
    clear_session()
    print("Logged out.")