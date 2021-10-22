from flask import Flask, request, jsonify, Response, abort, stream_with_context
from flask.json import JSONEncoder
import os, requests
from csgoinvshuffle.inventory import parse_inventory
from csgoinvshuffle.item import Item
import flask_praetorian
from typing import NamedTuple
from urllib.parse import urlencode
from flask_cors import CORS


class DummyUserClass(NamedTuple):
    identity: int
    rolenames: list = []


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
app.json_encoder = CustomJSONEncoder
if app.debug:
    app.config["CORS_ORIGINS "] = "http://localhost:3000"

else:
    app.config["CORS_ORIGINS "] = ""

guard = CustomGuard(app, DummyUserClass)
CORS(app)

steam_api_key = os.environ.get("STEAM_API_KEY")



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


@app.get("/logout")
def logout():
    resp = Response()
    resp.set_cookie("access_token", "", samesite="lax", httponly=True)
    return resp

@app.get("/inventory")
@flask_praetorian.auth_required
def get_inv():
    steam_id = flask_praetorian.current_user_id()
    r = requests.get(
        f"https://steamcommunity.com/profiles/{steam_id}/inventory/json/730/2",
        
        params=request.args,
    )
    if r.status_code == 200:
        resp = jsonify(list(filter(lambda x: x.equippable,parse_inventory(r.json(), steam_id))))
    else:
        resp = jsonify(r.json())
    resp.status=r.status_code
    return resp

def get_profile_data():
    steam_id = flask_praetorian.current_user_id()
    return requests.get(f"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002?key={steam_api_key}&steamids={steam_id}").json()


@app.get("/profile_picture")
@flask_praetorian.auth_required
def get_pp_link():
    
    return (
        jsonify(
            {
                "link": get_profile_data()
                .get("response", {})
                .get("players", [])[-1]
                .get("avatar", None)
            }
        ),
        200,
    )





if __name__ == "__main__":
    app.run()
