from csgoinvshuffle.enums import LoadoutSlot
from csgoinvshuffle.shuffle import SlotMap

from csgoinvshuffleweb.utils import (
    convert_json_to_slotmap,
    convert_slotmap_to_json,
    get_items_from_json,
)


def test_get_items_from_json():
    # No Items
    assert get_items_from_json([]) == []
    assert get_items_from_json([{"T": [], "CT": [], "general": []}]) == []
    json_slotmap = [
        {
            "T": ["items,", "we", "don't"],
            "CT": ["really", "need", "actual", "items"],
            "general": ["to", "test", "this", {"id": 12345}],
        }
    ]
    # Some Items
    assert len(get_items_from_json(json_slotmap)) == 11


def test_convert_slotmap_to_json_and_back():
    assert convert_slotmap_to_json(SlotMap(), []) == []

    slotmap_init = [
        (LoadoutSlot.DEAGLE_CT.value, ["508", "5443"]),
        (LoadoutSlot.DEAGLE_T.value, ["730"]),
        (LoadoutSlot.MUSIC_KIT.value, ["1234"]),
    ]

    slotmap = SlotMap(slotmap_init)

    item_list = [
        {
            "id": "508",
            "shuffle_slots_t": [LoadoutSlot.DEAGLE_T.value],
            "shuffle_slots_ct": [
                LoadoutSlot.REVOLVER_CT.value,
                LoadoutSlot.DEAGLE_CT.value,
            ],
        },
        {
            "id": "730",
            "shuffle_slots_t": [
                LoadoutSlot.DEAGLE_T.value,
                LoadoutSlot.REVOLVER_T.value,
            ],
        },
        {
            "id": "5443",
            "shuffle_slots_ct": [
                LoadoutSlot.REVOLVER_CT.value,
                LoadoutSlot.DEAGLE_CT.value,
            ],
        },
        {"id": "1234", "shuffle_slots": [LoadoutSlot.MUSIC_KIT.value]},
    ]

    json = [
        {"T": [item_list[1]], "CT": [item_list[0]], "general": [item_list[3]]},
        {"T": [], "CT": [item_list[2]], "general": []},
    ]

    assert convert_slotmap_to_json(slotmap, item_list) == json

    assert convert_json_to_slotmap([]) == SlotMap()
    assert convert_json_to_slotmap([{"T": [], "CT": [], "general": []}]) == SlotMap()
    converted_slotmap = convert_json_to_slotmap(json)
    assert (LoadoutSlot.DEAGLE_CT, ["508", "5443"]) == converted_slotmap[
        LoadoutSlot.DEAGLE_CT
    ]
    print(converted_slotmap)
    for _assert in slotmap_init:
        assert _assert in converted_slotmap
