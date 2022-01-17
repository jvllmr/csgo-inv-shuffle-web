from flask.testing import FlaskClient


def test_get_profile_picture(authed_client: FlaskClient):

    resp = authed_client.get("/profile_picture")
    assert resp.status_code == 200
    link = resp.get_json()["link"]
    assert link.startswith(
        "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars"
    ) or link.startswith(
        "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars"
    )
    cached_resp = authed_client.get("/profile_picture")
    assert cached_resp.status_code == 200
    cached_link = cached_resp.get_json()["link"]
    assert cached_link.startswith(
        "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars"
    ) or cached_link.startswith(
        "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars"
    )


def test_get_inv(authed_client: FlaskClient):
    resp = authed_client.get("/inventory")
    assert resp.status_code == 200
    assert "Irgendwie...NICHT" in map(lambda x: x["custom_name"], resp.json)
    cached_resp = authed_client.get("/inventory")
    assert cached_resp.status_code == 200
    assert "˓ฅ₍˄ุ.͡ ̫.˄ุ₎ฅ˒rawr!" in map(lambda x: x["custom_name"], cached_resp.json)
    cannot_request_uncached = authed_client.get("/inventory?no_cache=1")
    assert cannot_request_uncached.status_code == 429
    assert 500 < int(cannot_request_uncached.get_data(True))
