import typing as t
import xml.etree.ElementTree as xml_et

import flask_praetorian
import requests
from csgoinvshuffle.item import _slot_tag_map, _slot_tag_map_ct, _slot_tag_map_t
from csgoinvshuffle.shuffle import SlotMap


def get_profile_data() -> xml_et.Element:
    steam_id = flask_praetorian.current_user_id()

    return xml_et.fromstring(
        requests.get(f"https://steamcommunity.com/profiles/{steam_id}?xml=1").text
    )


item_dict = dict[str, t.Any]
mapslot_json_type = dict[
    t.Literal["CT"] | t.Literal["T"] | t.Literal["general"], list[item_dict]
]
map_json_type = list[mapslot_json_type]


def convert_to_slotmap(json: map_json_type) -> SlotMap:
    """Converts a JSON SlotMap to a SlotMap object"""
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


def flatten_json(json: map_json_type) -> list[item_dict]:
    """Converts a JSON SlotMap to a list of item dicts"""
    ret = list()

    for slot in json:
        for item_list in slot.values():
            for item in item_list:
                ret.append(item)
    return ret


def convert_to_json(
    slotmap: SlotMap, item_list: list[dict[str, t.Any]]
) -> map_json_type:
    """Converts a SlotMap object to a JSON SlotMap"""
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
