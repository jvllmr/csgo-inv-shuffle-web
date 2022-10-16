import os

from flask import Flask, Response, json
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
def user(steam_user_id: int):
    return DummyUserClass(steam_user_id)


@fixture
def app():
    app = create_app(testapp=True, SECRET_KEY="top_secret")
    app.response_class = TestingResponse
    return app


@fixture
def json_slotmap(app: Flask):
    with open(f"{os.path.dirname(__file__)}/data/map.json") as f:
        return json.loads(f.read(), app)


@fixture
def authed_client(app: Flask, guard: CustomGuard, user: DummyUserClass):
    with app.test_client() as client:
        client.set_cookie(
            "localhost.localdomain",
            "access_token",
            guard.encode_eternal_jwt_token(
                user,
                bypass_user_check=True,
            ),
        )
        yield client
        client.delete_cookie("localhost.localdomain", "access_token")


@fixture
def cache(app: Flask):
    return cache_object


@fixture
def guard(app: Flask):
    return guard_object
