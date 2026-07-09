import os
from flask import Flask
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage

from Backend.database import init_db
from Backend.config import load_config


from Backend.controllers import (
    setup_jwt,
)

from Backend.views import views



def add_views(app):
    for view in views:
        app.register_blueprint(view)

def create_app(overrides={}):
    app = Flask(__name__, static_url_path='/Backend')
    load_config(app, overrides)
    CORS(app)
    add_views(app)
    init_db(app)
    jwt = setup_jwt(app)
    app.app_context().push()
    return app