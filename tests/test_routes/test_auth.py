from flask.testing import FlaskClient


def test_refresh_token(client: FlaskClient):
    pass


def test_logout(authed_client: FlaskClient):
    authed_client.get("/logout")
    assert authed_client.get("/inventory").status_code == 401


def test_auth(client: FlaskClient, authed_client: FlaskClient):
    pass
