import os
import re

import requests
from flask import Flask, Response, abort, render_template

from services.jellyfin import get_now_playing

app = Flask(__name__)


@app.get("/")
def home():
    return render_template("index.html")

@app.get("/api/now-playing")
def now_playing():
    try:
        track = get_now_playing()
    except (requests.RequestException, KeyError, ValueError):
        return {"playing": False, "track": None, "error": "Music service unavailable"}, 503

    return {
        "playing": track is not None,
        "track": track
    }


@app.get("/api/artwork/<item_id>")
def artwork(item_id):
    if not re.fullmatch(r"[a-fA-F0-9-]{32,36}", item_id):
        abort(404)
    try:
        response = requests.get(
            f"https://media.fngpr.eu/Items/{item_id}/Images/Primary",
            params={"maxWidth": 256, "quality": 85},
            headers={"Authorization": f'MediaBrowser Token="{os.environ["JELLYFIN_API_KEY"]}"'},
            timeout=5,
        )
        response.raise_for_status()
    except (requests.RequestException, KeyError):
        abort(404)
    content_type = response.headers.get("Content-Type", "")
    if not content_type.startswith("image/"):
        abort(404)
    return Response(response.content, content_type=content_type, headers={"Cache-Control": "public, max-age=3600"})
