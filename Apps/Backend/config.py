import os

def load_config(app, overrides):
    if os.path.exists(os.path.join('./Backend', 'custom_config.py')):
        app.config.from_object('Backend.custom_config')
    else:
        app.config.from_object('Backend.default_config')
    app.config.from_prefixed_env()
    # docker-compose supplies these as plain (un-prefixed) env vars, which
    # from_prefixed_env() would miss; apply them explicitly when present so the
    # container talks to MSSQL instead of falling back to the sqlite default.
    if os.environ.get('SQLALCHEMY_DATABASE_URI'):
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['SQLALCHEMY_DATABASE_URI']
    if os.environ.get('SECRET_KEY'):
        app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['PREFERRED_URL_SCHEME'] = 'https'
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    for key in overrides:
        app.config[key] = overrides[key]