import flask_praetorian, requests
from flask import abort, Response, Blueprint, request
from csgoinvshuffleweb.extensions.auth import DummyUserClass, guard
from urllib.parse import urlencode

auth = Blueprint("auth", __name__)


@auth.get("/auth")
def auth_method():
    try:
        params = dict(request.args)
        del params["openid.mode"]
        params["openid.mode"] = "check_authentication"

        r = requests.get(f"https://steamcommunity.com/openid/login?{urlencode(params)}")
        print(r.text)
        if not "true" in r.text.split("is_valid:")[1]:
            abort(400)

        token = guard.encode_jwt_token(
            DummyUserClass(int(params["openid.identity"].split("/")[-1])),
            bypass_user_check=True,
        )
        resp = Response("Valid")
        resp.set_cookie(
            "access_token", token, samesite="lax", httponly=True, max_age=86_400
        )

        return resp

    except Exception as exc:
        print(exc)
        abort(400)


@auth.get("/refresh_token")
def refresh_token():
    token = guard.read_token()
    token = guard.refresh_jwt_token(token)
    resp = Response("Valid")
    resp.set_cookie(
        "access_token", token, samesite="lax", httponly=True, max_age=86_400
    )
    return resp


@auth.get("/logout")
@flask_praetorian.auth_required
def logout():
    steam_id = flask_praetorian.current_user_id()
    resp = Response()
    resp.set_cookie("access_token", "", samesite="lax", httponly=True)
    return resp
