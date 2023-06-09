import datetime
import time

from flask.testing import FlaskClient

from csgoinvshuffleweb.extensions.auth import CustomGuard, DummyUserClass


def test_refresh_token(client: FlaskClient, guard: CustomGuard, user: DummyUserClass):
    token = guard.encode_jwt_token(
        user, override_access_lifespan=datetime.timedelta(seconds=1)
    )
    time.sleep(2)
    client.set_cookie(key="access_token", value=token)
    assert client.get("/profile_picture").status_code == 401
    assert client.get("/refresh_token").status_code == 200
    assert client.get("/profile_picture").status_code == 200
    client.delete_cookie(key="access_token")


def test_logout(authed_client: FlaskClient):
    authed_client.get("/logout")
    assert authed_client.get("/inventory").status_code == 401


def test_auth(client: FlaskClient, authed_client: FlaskClient):
    assert client.get("/profile_picture").status_code == 401
    assert authed_client.get("/profile_picture").status_code == 200
