from flask import Flask, request, jsonify, Response
import os, requests
from csgoinvshuffle.inventory import parse_inventory

app = Flask(__name__)

steam_api_key = os.environ.get("STEAM_API_KEY")
print(steam_api_key)
@app.get("/profile_data/<steam_id>")
def get_pp_link(steam_id):
    return (
        Response(
            requests.get(
                f"https://steamcommunity.com/profiles/{steam_id}?xml=1"
            ).content,
            status=200,
            mimetype="text/xml",
        ),
        200,
    )


@app.post("/inventory")
def get_inv():
    return jsonify(list(parse_inventory(request.json)))


if __name__ == "__main__":
    app.run()
