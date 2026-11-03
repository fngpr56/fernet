import os

import requests


def get_now_playing():

    api_key = os.environ["JELLYFIN_API_KEY"]

    response = requests.get(
        "https://media.fngpr.eu/Sessions",
        headers={"Authorization": f'MediaBrowser Token="{api_key}"'},
        timeout=5,
    )

    response.raise_for_status()
    sessions = response.json()

    track = {}

    for session in sessions:
        item = session.get("NowPlayingItem")
        state = session.get("PlayState") or {}

        if item is None or item.get("Type") != "Audio" or state.get("IsPaused"):
            continue

        song = item.get("Name")
        artists = item.get("Artists", [])
        track["artist"] = ", ".join(artists)
        track["title"] = song

        track["album"] = item.get("Album")
        track["position"] = state.get("PositionTicks", 0) / 10_000_000
        track["duration"] = item.get("RunTimeTicks", 0) / 10_000_000
        image_id = item.get("Id") if item.get("ImageTags", {}).get("Primary") else item.get("AlbumId")
        track["artwork"] = f"/api/artwork/{image_id}" if image_id else None
        return track

    return None


if __name__ == "__main__":
    print(get_now_playing())
