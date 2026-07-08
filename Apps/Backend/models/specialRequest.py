from Backend.database import db

class SpecialRequest(db.Model):
    __tablename__ = "special_requests"
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50), nullable = False, unique = True)
    description = db.Column(db.String(200), nullable = False)

    def __init__(self,id, name, description):
        self.name = name
        self.description = description
    
    def get_json(self):
        return{
            'id': self.id,
            'name': self.name,
            'description': self.description
        }