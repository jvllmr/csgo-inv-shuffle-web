import flask_praetorian
from csgoinvshuffle.shuffle import ShuffleConfig
from flask import Blueprint, jsonify
from pydantic import BaseModel

from csgoinvshuffleweb.extensions.validation import api_validator
from csgoinvshuffleweb.utils import (
    convert_to_json,
    convert_to_slotmap,
    flatten_json,
    map_json_type,
)

config = Blueprint("config", __name__)


class DoConfigStuffModel(BaseModel):
    map: map_json_type


@config.post("/random")
@flask_praetorian.auth_required
@api_validator.validate(tags=("Config",))
def randomize(json: DoConfigStuffModel):
    """
    Takes a JSON SlotMap and returns a randomized version with a length of 100 MapSlots
    """
    sc = ShuffleConfig()
    sc._slotmap = convert_to_slotmap(json.map)
    sc.randomize(99)
    return jsonify(convert_to_json(sc._slotmap, flatten_json(json.map)))


@config.post("/generate")
@flask_praetorian.auth_required
@api_validator.validate(tags=("Config",))
def generate(json: DoConfigStuffModel):
    """Takes a JSON SlotMap and generates the config. Returns it as a string"""
    sc = ShuffleConfig()
    sc._slotmap = convert_to_slotmap(json.map)
    return sc.generate()
