from csgoinvshuffle.item import Item
from flask import Flask
from flask.json import JSONEncoder
from flask_cors import CORS

from csgoinvshuffleweb.config import DevConfig, ProdConfig
from csgoinvshuffleweb.extensions import create_cache, create_guard, create_validator
from csgoinvshuffleweb.routes import blueprints


class CustomJSONEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, Item):
            return dict(o)
        return super().default(o)


def create_app(testapp=False, **config_vars) -> Flask:
    app = Flask(__name__)

    app.json_encoder = CustomJSONEncoder
    if app.debug or testapp:
        app.config.from_object(DevConfig())

    else:
        app.config.from_object(ProdConfig())

    for k, v in config_vars.items():
        app.config[k] = v

    for bp in blueprints:
        app.register_blueprint(bp)

    # register extensions
    create_guard(app)
    create_validator(app)
    create_cache(app)
    CORS(app)
    return app


if __name__ == "__main__":
    app = create_app()
    app.run()
