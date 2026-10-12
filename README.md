# Fernet

Personal website and future home for my projects, homelab, and other self-hosted services.
The name Fernet comes from a drink: a bitter, aromatic Italian herbal liqueur (amaro), usually containing around 40% alcohol by volume.

**Website:** https://fngpr.eu  
**Status:** v0.1 — homepage

## Stack

- **Backend:** Python, Flask, Jinja2
- **Frontend:** HTML, plain CSS
- **Deployment:** Docker Compose, Gunicorn, Caddy
- **DNS:** Porkbun

No database, JavaScript framework, or build step for the frontend.

## Project structure

```text
fernet/
  app.py
  requirements.txt
  Dockerfile
  compose.yaml
  .dockerignore
  README.md
  templates/
    index.html
  static/
    style.css
    dead-king.png
```

## Run locally

For development without Docker:

```bash
python3 -m venv .venv
./.venv/bin/pip install -r requirements.txt
./.venv/bin/flask --app app run --debug
```

Open http://127.0.0.1:5000.

Or build and run with Docker:

```bash
docker compose up -d --build
```

Open http://127.0.0.1:8000 on the machine running Docker.

## Server deployment

The project is hosted on my Ubuntu server at `/home/fngpr/fernet`.

```text
fngpr.eu → Caddy (HTTPS) → Docker (127.0.0.1:8000) → Gunicorn → Flask
```

Caddy runs on the host. Its site block in `/etc/caddy/Caddyfile`:

```caddyfile
fngpr.eu {
    reverse_proxy 127.0.0.1:8000
}
```

Docker Compose runs the Flask app. Port 8000 is bound to the host's loopback address, so Caddy is the public entry point.

From the project directory:

```bash
# Start or rebuild after changes
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f

# Restart without rebuilding
docker compose restart

# Stop
docker compose down
```

The application container uses `restart: unless-stopped` to start again after a reboot when Docker starts.

Caddy commands:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Code, HTML, and CSS are copied into the Docker image, so rebuild after editing them with `docker compose up -d --build`. You may need to refresh the browser cache for CSS changes.

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

Keep the site simple. Add libraries and infrastructure only when needed, and update this README as the project grows.