from werkzeug.security import check_password_hash, generate_password_hash
from Backend.database import db

from Backend.models.accttype import AccountTypeEnum


class User(db.Model):
    __tablename__ = "users"
    usersID = db.Column(db.String(20), primary_key=True)
    fName =  db.Column(db.String(20), nullable=False, unique=True)
    lName = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(60), nullable=False, unique=True)
    passportIDN = db.Column(db.String(20), nullable=True, unique = True)
    password = db.Column(db.String(256), nullable=True)
    nationality = db.Column(db.String(20), nullable = True)
    DOB = db.Column(db.Date, nullable = True)
    gender = db.Column(db.String(1), nullable = True)
    cNumber = db.Column(db.String(20), nullable = True)
    aType = db.Column(db.Enum(AccountTypeEnum), nullable = False)
    specialR = db.Column(db.Integer, db.ForeignKey('special_requests.id'), nullable = True)



    def __init__(self,UID, fName, lName, email, passportIDN, password, nationality, DOB, gender, cNumber, aType, specialR):
        self.usersID = UID 
        self.fName = fName
        self.lName = lName
        self.email = email
        self.passportIDN = passportIDN
        self.aType = aType
        self.set_password(password)
        self.nationality = nationality
        self.DOB = DOB
        self.gender = gender
        self.cNumber = cNumber
        self.specialR = specialR

    def get_json(self):
        return{
            'id': self.usersID,
            'fname': self.fName,
            'lname': self.lName,
            'email':self.email,
            'nationality': self.nationality,
            'DOB': self.DOB,
            'gender': self.gender,
            'cNumber': self.cNumber,
            'aType': self.aType.name if self.aType else None,
            'specialR': self.specialR

        }

    def set_password(self, password):
        """Create hashed password."""
        if password and self.aType == AccountTypeEnum.ADMIN:
            self.password = generate_password_hash(password)
        else:
            password = None

    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password, password)

