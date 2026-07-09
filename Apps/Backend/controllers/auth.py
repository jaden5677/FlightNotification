from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity, verify_jwt_in_request
import re
from Backend.models import User
from Backend.database import db
from Backend.models.notiftype import NotifType
from Backend.models.accttype import AccountTypeEnum
emailpattern = re.compile(r'^[A-Za-z.]+@caribbean-airlines\.com$', re.IGNORECASE)

def login(email, password):
  if not email or not emailpattern.match(email):
    return None
  user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
  if user and user.aType == AccountTypeEnum.ADMIN and user.check_password(password):
     return create_access_token(identity = user.usersID)
  return None


def setup_jwt(app):
  jwt = JWTManager(app)

  # Always store a string user id in the JWT identity (sub),
  # whether a User object or a raw id is passed.
  @jwt.user_identity_loader
  def user_identity_lookup(identity):
    user_id = getattr(identity, "id", identity)
    return str(user_id) if user_id is not None else None

  @jwt.user_lookup_loader
  def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    # Cast back to int primary key
    try:
      user_id = identity
    except (TypeError, ValueError):
      return None
    return db.session.get(User, user_id)

  return jwt
