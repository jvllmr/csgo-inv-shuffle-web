from flask import Response, json
from flask.testing import FlaskClient
from pytest import fixture

from csgoinvshuffleweb.extensions.auth import CustomGuard, DummyUserClass
from csgoinvshuffleweb.extensions.auth import guard as guard_object
from csgoinvshuffleweb.extensions.cache import cache as cache_object
from csgoinvshuffleweb.flaskapp import create_app


class TestingResponse(Response):
    @property
    def json(self):
        return json.loads(self.data)


@fixture
def steam_user_id():
    return 76561198232352624


@fixture
def app():
    app = create_app(testapp=True, SECRET_KEY="top_secret")
    app.response_class = TestingResponse
    return app


@fixture
def authed_client(client: FlaskClient, guard: CustomGuard, steam_user_id: int):
    client.set_cookie(
        "localhost.localdomain",
        "access_token",
        guard.encode_eternal_jwt_token(
            DummyUserClass(steam_user_id),
            bypass_user_check=True,
        ),
    )
    yield client
    client.delete_cookie("localhost.localdomain", "access_token")


@fixture
def cache(app):
    return cache_object


@fixture
def guard(app):
    return guard_object
