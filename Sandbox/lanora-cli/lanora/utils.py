from lanora.config import get_token

def require_auth(func):
    def wrapper(*args, **kwargs):
        token = get_token()

        if not token:
            print("\n You are not logged in.")
            print("Run: Lanora login\n")
            return
        
        return func(token, *args, **kwargs)
    
    return wrapper

