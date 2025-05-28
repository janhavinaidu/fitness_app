from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# A dict to store users: key=email, value=dict with username, hashed_password
users_db = {}

def add_user(username: str, email: str, password: str):
    hashed_password = pwd_context.hash(password)
    users_db[email] = {
        "username": username,
        "email": email,
        "hashed_password": hashed_password,
    }

def get_user(email: str):
    return users_db.get(email)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)
