const player = document.querySelector(".now-playing");
const title = document.getElementById("now-playing");
const artist = document.getElementById("player-artist");
const album = document.getElementById("player-album");
const artwork = document.getElementById("player-art");
const status = document.getElementById("player-status");
const progress = document.getElementById("player-progress");
const elapsed = document.getElementById("player-elapsed");
const duration = document.getElementById("player-duration");

function formatTime(seconds) {
    const value = Math.max(0, Math.floor(Number(seconds) || 0));
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}

artwork.addEventListener("error", () => { artwork.hidden = true; });

function resetPlayer(unavailable) {
    player.dataset.state = unavailable ? "error" : "idle";
    status.textContent = unavailable ? "OFFLINE / JELLYFIN" : "ON STANDBY / JELLYFIN";
    title.textContent = unavailable ? "Signal lost." : "A little quiet right now.";
    artist.textContent = unavailable ? "The listening room is unavailable. Trying again soon." : "Nothing playing. The next record will appear here.";
    album.textContent = "PERSONAL SOUNDTRACK / LIVE FROM JELLYFIN";
    artwork.hidden = true;
    artwork.removeAttribute("src");
    progress.value = 0;
    elapsed.textContent = duration.textContent = "--:--";
}

async function updateNowPlaying() {
    try {
        const response = await fetch("/api/now-playing", { signal: AbortSignal.timeout(10000), cache: "no-store" });
        if (!response.ok) throw new Error("Music service unavailable");
        const data = await response.json();
        if (!data.playing || !data.track) {
            resetPlayer(false);
            return;
        }
        const track = data.track;
        player.dataset.state = "playing";
        status.textContent = "ON AIR / JELLYFIN";
        title.textContent = track.title || "Untitled track";
        artist.textContent = track.artist || "Unknown artist";
        album.textContent = track.album || "PERSONAL SOUNDTRACK";
        if (track.artwork) {
            if (artwork.getAttribute("src") !== track.artwork) {
                artwork.hidden = false;
                artwork.src = track.artwork;
            }
            artwork.alt = track.album ? `Cover of ${track.album}` : "Album cover";
        } else {
            artwork.hidden = true;
            artwork.removeAttribute("src");
        }
        progress.max = Math.max(1, Number(track.duration) || 0);
        progress.value = Math.max(0, Number(track.position) || 0);
        elapsed.textContent = formatTime(track.position);
        duration.textContent = track.duration ? formatTime(track.duration) : "--:--";
    } catch {
        resetPlayer(true);
    } finally {
        window.setTimeout(updateNowPlaying, 15000);
    }
}

updateNowPlaying();
