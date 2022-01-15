from flask import jsonify, Blueprint, request
import flask_praetorian
from csgoinvshuffle.shuffle import ShuffleConfig
from csgoinvshuffleweb.utils import convert_to_json, convert_to_slotmap, flatten_json

config = Blueprint("config", __name__)


@config.post("/random")
@flask_praetorian.auth_required
def randomize():
    sc = ShuffleConfig()
    sc._slotmap = convert_to_slotmap(request.json)
    sc.randomize(99)
    return jsonify(convert_to_json(sc._slotmap, flatten_json(request.json)))


@config.post("/generate")
@flask_praetorian.auth_required
def generate():
    sc = ShuffleConfig()
    sc._slotmap = convert_to_slotmap(request.json)
    return sc.generate()
