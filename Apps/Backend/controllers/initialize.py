from .user import create_user
from Backend.database import db
from Backend.models.accttype import AccountTypeEnum

def initialize():
    db.drop_all()
    db.create_all()
    create_user('AD101', 'Jaden', 'Sooklal', 'jaden.sooklal@caribbean-airlines.com', None, "JayPass", None, None, None, None, AccountTypeEnum.ADMIN, None)
