from flask import Flask, request, jsonify, Response, abort, stream_with_context
from flask.json import JSONEncoder
import os, requests
from csgoinvshuffle.inventory import get_inventory
from csgoinvshuffle.item import Item
from csgoinvshuffle.exceptions import InventoryIsPrivateException
import flask_praetorian
from typing import NamedTuple
from urllib.parse import urlencode
from flask_cors import CORS
from xml.etree import ElementTree as xml_et
from flask_caching import Cache


class DummyUserClass(NamedTuple):
    identity: int
    rolenames: list = []

    @classmethod
    def identify(cls, id):
        return cls(id, [])


class CustomGuard(flask_praetorian.Praetorian):
    def _validate_user_class(self, user_class):
        return user_class


class CustomJSONEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, Item):
            return dict(o)
        return super().default(o)


app = Flask(__name__)
app.config["SECRET_KEY"] = "9465988C5E63ED1444BA12EE1B591"
app.config["JWT_ACCESS_LIFESPAN"] = {"minutes": 15}
app.config["JWT_REFRESH_LIFESPAN"] = {"hours": 18}
app.config["CORS_SUPPORTS_CREDENTIALS"] = True
cache_config={"CACHE_TYPE":"RedisCache"}
app.json_encoder = CustomJSONEncoder
if app.debug:
    app.config["CORS_ORIGINS "] = "http://localhost:3000"

else:
    app.config["CORS_ORIGINS "] = ""

guard = CustomGuard(app, DummyUserClass)
cache= Cache(app, config=cache_config)
cache.clear()
CORS(app)


@app.get("/auth")
def auth():
    try:
        params = dict(request.args)
        del params["openid.mode"]
        params["openid.mode"] = "check_authentication"
        # print(f"https://steamcommunity.com/openid/login?{urlencode(params)}")

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


@app.get("/refresh_token")
def refresh_token():
    token = guard.read_token()
    token = guard.refresh_jwt_token(token)
    resp = Response("Valid")
    resp.set_cookie(
        "access_token", token, samesite="lax", httponly=True, max_age=86_400
    )
    return resp


@app.get("/logout")
def logout():
    resp = Response()
    resp.set_cookie("access_token", "", samesite="lax", httponly=True)
    return resp



    



"""
@app.get("/item_icon/<item_id>")
@flask_praetorian.auth_required
def get_item_icon(item_id):
    r = requests.get(
        f"https://community.cloudflare.steamstatic.com/economy/image/{item_id}"
    )

    bytes_ = BytesIO(r.content)
    bytes_.seek(0)
    img = Image.open(bytes_)
    img = img.resize((128, 96))
    ret_bytes = BytesIO()
    img.save(ret_bytes, format="PNG")
    ret_bytes.seek(0)
    return send_file(ret_bytes, mimetype="image/png")
"""


@app.get("/inventory")
@flask_praetorian.auth_required
def get_inv():
    
    steam_id = flask_praetorian.current_user_id()
    if (cached:= cache.get(f"inventory_{steam_id}")) and not request.args.get('no_cache', 0):
        return cached
    try:
        resp = jsonify(list(filter(lambda x: x.equippable, get_inventory(steam_id))))
        
        cache.set(f"inventory_{steam_id}", resp, timeout=3600)
        return resp
    except InventoryIsPrivateException:
        abort(403)
    except requests.HTTPError:
        abort(429)


def get_profile_data() -> xml_et.Element:
    steam_id = flask_praetorian.current_user_id()

    return xml_et.fromstring(
        requests.get(f"https://steamcommunity.com/profiles/{steam_id}?xml=1").text
    )


@app.get("/profile_picture")
@flask_praetorian.auth_required

def get_pp_link():
    steam_id = flask_praetorian.current_user_id()
    if (cached:= cache.get(f"pp_{steam_id}")) and not request.args.get('no_cache', 0):
        
        return cached
    for child in get_profile_data():
        if child.tag == "avatarIcon":
            ret = child.text
    resp = (
        jsonify(link=ret),
        200,
    )
    cache.set(f"pp_{steam_id}", resp, timeout=1800)
    return  resp


if __name__ == "__main__":
    app.run()
