from urllib.parse import urlencode

import flask_praetorian
import requests
from flask import Blueprint, Response, abort, request
from pydantic import BaseModel, Field

from csgoinvshuffleweb.extensions.auth import DummyUserClass, guard
from csgoinvshuffleweb.extensions.validation import api_validator

auth = Blueprint("auth", __name__)


class Auth(BaseModel):
    ns: str = Field(alias="openid.ns")
    identity: str = Field(alias="openid.identity")
    claimed_id: str = Field(alias="openid.claimed_id")
    mode: str = Field(alias="openid.mode")
    return_to: str = Field(alias="openid.return_to")


@auth.get("/auth")
@api_validator.validate(tags=("Auth",))
def auth_method(query: Auth):
    """Authenticate the user"""
    try:
        params = dict(request.args)
        del params["openid.mode"]
        params["openid.mode"] = "check_authentication"

        r = requests.get(f"https://steamcommunity.com/openid/login?{urlencode(params)}")

        if "true" not in r.text.split("is_valid:")[1]:
            abort(400)

        token = guard.encode_jwt_token(
            DummyUserClass(int(params["openid.identity"].split("/")[-1])),
            bypass_user_check=True,
        )
        resp = Response("Valid")
        resp.set_cookie(
            "access_token", token, samesite="strict", httponly=True, max_age=86_400 * 3
        )

        return resp

    except Exception:
        abort(400)


class RefreshTokenModel(BaseModel):
    access_token: str


@auth.get("/refresh_token")
@api_validator.validate(tags=("Auth",))
def refresh_token(cookies: RefreshTokenModel):
    """Refresh the auth token of a user"""
    token = guard.read_token()
    token = guard.refresh_jwt_token(token)
    resp = Response("Valid")
    resp.set_cookie(
        "access_token", token, samesite="strict", httponly=True, max_age=86_400 * 3
    )
    return resp


@auth.get("/logout")
@flask_praetorian.auth_required
@api_validator.validate(tags=("Auth",))
def logout():
    """Logout the user"""
    resp = Response()
    resp.set_cookie("access_token", "", samesite="strict", httponly=True)
    return resp
