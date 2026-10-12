# Web Portal

Personal website and future home for my projects, homelab, and other things I host.

**Website:** https://fngpr.eu  
**Status:** v0.1 — homepage

## Stack

- **Backend:** Python, Flask, Jinja2
- **Frontend:** HTML, plain CSS
- **Production:** Gunicorn, Caddy, systemd
- **DNS:** Porkbun

No database, JavaScript framework, or build step yet.

## Project structure

```text
fngpr-home/
├── app.py                 # Flask routes
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html         # Homepage
├── static/
│   ├── style.css          # Layout and styling
│   └── dead-king.png      # Homepage artwork
└── README.md
```

## Run locally

From the project directory:

```bash
python3 -m venv .venv
./.venv/bin/pip install -r requirements.txt
./.venv/bin/flask --app app run --debug
```

Open http://127.0.0.1:5000.

## Server deployment

The project is hosted on my Ubuntu server at `/home/fngpr/fngpr-home`.

```text
fngpr.eu → Caddy (HTTPS) → Gunicorn (127.0.0.1:8000) → Flask
```

Caddy site block (`/etc/caddy/Caddyfile`):

```caddyfile
fngpr.eu {
    reverse_proxy 127.0.0.1:8000
}
```

The Flask app runs as the `fngpr-home` systemd service.

Useful commands:

```bash
sudo systemctl status fngpr-home
sudo systemctl restart fngpr-home
journalctl -u fngpr-home -f
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

After changing Python code, restart `fngpr-home`. HTML/CSS changes normally only require refreshing the browser (possibly bypassing cache).

## Current features

- Responsive homepage with a fixed desktop sidebar
- Personal introduction and interests
- Placeholder navigation for future pages
- Custom black/grey/red styling and artwork

## Next steps

- [ ] Add About, Projects, and Links pages
- [ ] Add a private homelab dashboard
- [ ] Show status from Jellyfin, Nextcloud, and other services
- [ ] Add a local AI interface
- [ ] Add authentication before exposing private tools

## Notes

Keep the site simple. Add libraries and infrastructure only when a feature actually needs them. Update this README whenever the setup or functionality changes.
