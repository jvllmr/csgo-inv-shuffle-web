from config import DevConfig, ProdConfig
from csgoinvshuffle.item import Item
from flask import Flask
from flask.json import JSONEncoder
from flask_cors import CORS

from csgoinvshuffleweb.extensions import create_cache, create_guard, create_validator
from csgoinvshuffleweb.routes import blueprints


class CustomJSONEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, Item):
            return dict(o)
        return super().default(o)


def create_app() -> Flask:
    app = Flask(__name__)

    app.json_encoder = CustomJSONEncoder
    if app.debug:
        app.config.from_object(DevConfig())

    else:
        app.config.from_object(ProdConfig())

    for bp in blueprints:
        app.register_blueprint(bp)

    CORS(app)
    return app


app = create_app()
guard = create_guard(app)
cache = create_cache(app)
api_validator = create_validator(app)


if __name__ == "__main__":
    app.run()
