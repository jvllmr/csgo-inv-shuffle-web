from csgoinvshuffle.shuffle import SlotMap
from flask import (
    Flask,
    request,
    jsonify,
    Response,
    abort,
    current_app,
)
from flask.json import JSONEncoder, load
import os, requests, flask_praetorian, datetime
from csgoinvshuffle.inventory import get_inventory
from csgoinvshuffle.item import Item, _slot_tag_map, _slot_tag_map_ct, _slot_tag_map_t
from csgoinvshuffle.exceptions import InventoryIsPrivateException
from csgoinvshuffle import ShuffleConfig
from typing import NamedTuple
from urllib.parse import urlencode
from flask_cors import CORS
from xml.etree import ElementTree as xml_et
from flask_caching import Cache
import typing as t
import traceback

from werkzeug.exceptions import InternalServerError


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


cache_config = {"CACHE_TYPE": "RedisCache"}

app.json_encoder = CustomJSONEncoder
if app.debug:
    app.config["CORS_ORIGINS "] = "http://localhost:3000"

else:
    app.config["CORS_ORIGINS "] = "https://csgoinvshuffle.kreyoo.dev"
    app.config["CACHE_REDIS_URL"] = os.environ.get("REDIS_TLS_URL")

guard = CustomGuard(app, DummyUserClass)
cache = Cache(app, config=cache_config)
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
@flask_praetorian.auth_required
def logout():
    steam_id = flask_praetorian.current_user_id()
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
    if (cached := cache.get(f"inventory_{steam_id}")) and not request.args.get(
        "no_cache", 0
    ):
        return cached
    try:
        if datetime.timedelta(minutes=10) > (
            re_timeout := (
                datetime.datetime.now()
                - (
                    cache.get(f"timeout_{steam_id}")
                    or (datetime.datetime.now() - datetime.timedelta(minutes=11))
                )
            )
        ):
            return f"{600 - re_timeout.seconds}", 429

        def filter_equippable(item: Item):
            return item.equippable

        resp = jsonify(list(filter(filter_equippable, get_inventory(steam_id))))
        cache.set(f"inventory_{steam_id}", resp, timeout=3600)
        cache.set(f"timeout_{steam_id}", datetime.datetime.now(), timeout=1200)
        return resp
    except InventoryIsPrivateException:
        abort(403)
    except requests.HTTPError:
        cache.set(f"timeout_{steam_id}", datetime.datetime.now(), timeout=1200)
        return "600", 429


def get_profile_data() -> xml_et.Element:
    steam_id = flask_praetorian.current_user_id()

    return xml_et.fromstring(
        requests.get(f"https://steamcommunity.com/profiles/{steam_id}?xml=1").text
    )


@app.get("/profile_picture")
@flask_praetorian.auth_required
def get_pp_link():
    steam_id = flask_praetorian.current_user_id()
    if (cached := cache.get(f"pp_{steam_id}")) and not request.args.get("no_cache", 0):

        return cached
    for child in get_profile_data():
        if child.tag == "avatarIcon":
            ret = child.text
    resp = (
        jsonify(link=ret),
        200,
    )
    cache.set(f"pp_{steam_id}", resp, timeout=1800)
    return resp


json_type = list[dict[str, list[dict[str, t.Any]]]]


def convert_to_slotmap(json: json_type) -> SlotMap:
    ret = SlotMap()
    for slot in json:
        for side, item_list in slot.items():
            if side == "CT":
                keyname = "shuffle_slots_ct"

            elif side == "T":
                keyname = "shuffle_slots_t"
            else:
                keyname = "shuffle_slots"

            for item in item_list:
                for loadout_slot in item[keyname]:
                    ret.append(loadout_slot, item["id"])

    return ret


def flatten_json(json: json_type) -> list[dict[str, t.Any]]:
    ret = list()

    for slot in json:
        for item_list in slot.values():
            for item in item_list:
                ret.append(item)
    return ret


def convert_to_json(slotmap: SlotMap, item_list: list[dict[str, t.Any]]) -> json_type:
    ret = list()
    for _ in range(max(map(lambda x: len(x[1]), slotmap))):
        ret.append({"CT": [], "T": [], "general": []})

    def add_item(key: str, cycle: int, item: dict[str, t.Any]):
        for sussy_item in ret[cycle][key]:
            for k in ("shuffle_slots", "shuffle_slots_t", "shuffle_slots_ct"):
                for slot in sussy_item[k]:
                    if slot in item[k]:
                        return
        ret[cycle][key].append(item)

    for slot, ids in slotmap:
        for cycle, id in enumerate(ids):
            for item in item_list:
                if item["id"] == id:
                    the_item = item
                    break

            if slot in _slot_tag_map_t:
                add_item("T", cycle, the_item)
            elif slot in _slot_tag_map_ct:
                add_item("CT", cycle, the_item)
            elif slot in _slot_tag_map:
                add_item("general", cycle, the_item)
    return ret


@app.post("/random")
@flask_praetorian.auth_required
def randomize():
    sc = ShuffleConfig()
    sc._slotmap = convert_to_slotmap(request.json)
    sc.randomize(99)
    return jsonify(convert_to_json(sc._slotmap, flatten_json(request.json)))


@app.post("/generate")
@flask_praetorian.auth_required
def generate():
    sc = ShuffleConfig()
    sc._slotmap = convert_to_slotmap(request.json)
    return sc.generate()


@app.errorhandler(Exception)
def handle_500(e: Exception):
    current_app.logger.error(
        str(e) + "\n" + "".join(traceback.TracebackException.from_exception(e).format())
    )
    return "Bad request", 400


if __name__ == "__main__":
    app.run()
