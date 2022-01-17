from flask.testing import FlaskClient

from csgoinvshuffleweb.utils import map_json_type


def test_generate(authed_client: FlaskClient, json_slotmap: map_json_type):

    resp = authed_client.post("/generate", json={"map": json_slotmap})
    assert resp.status_code == 200
    assert resp.get_data(True).startswith('"SavedItemShuffles"\n{')


def test_random(authed_client: FlaskClient, json_slotmap: map_json_type):
    resp = authed_client.post("/random", json={"map": json_slotmap})
    assert resp.status_code == 200
    resp_json: map_json_type = resp.get_json()
    assert isinstance(resp_json, list)
    assert len(resp_json) == 100
    for slot in resp_json:
        assert "T" in slot
        assert "CT" in slot
        assert "general" in slot
        for items in slot.values():
            assert isinstance(items, list)
