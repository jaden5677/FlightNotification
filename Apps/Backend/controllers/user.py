from Backend.models import User
from Backend.database import db

def create_user(UID, fName, lName, email, passportIDN, password, nationality, DOB, gender, cNumber, aType, specialR):
    newuser = User(UID = UID, password=password, fName = fName, lName = lName, email = email, passportIDN = passportIDN, nationality = nationality, DOB = DOB, gender = gender, cNumber = cNumber, aType = aType, specialR = specialR)
    db.session.add(newuser)
    db.session.commit()
    return newuser

def get_user_by_email(email):
    result = db.session.execute(db.select(User).filter_by(email=email))
    return result.scalar_one_or_none()

def get_user(id):
    return db.session.get(User, id)

def get_user_by_full_name(fName, lName):
    result = db.session.execute(db.select(User).filter_by(fName=fName,lName=lName))
    return result.scalar_one_or_none()

def get_all_users():
    return db.session.scalars(db.select(User)).all()

def get_all_users_json():
    users = get_all_users()
    if not users:
        return []
    users = [user.get_json() for user in users]
    return users

def update_user(id, email):
    user = get_user(id)
    if user:
        user.email = email
        # user is already in the session; no need to re-add
        db.session.commit()
        return True
    return None
