import os

def load_config(app, overrides):
    if os.path.exists(os.path.join('./Backend', 'custom_config.py')):
        app.config.from_object('Backend.custom_config')
    else:
        app.config.from_object('Backend.default_config')
    app.config.from_prefixed_env()
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['PREFERRED_URL_SCHEME'] = 'https'
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    for key in overrides:
        app.config[key] = overrides[key]