# Virtual Time Capsule — Share package

This folder contains a minimal, ready-to-run Docker Compose setup that lets a collaborator pull the published images from Docker Hub and run the full stack (Postgres + API + client) without cloning the repository.

Files:

- `docker-compose.yml` — Compose file that references the published images.
- `.env.example` — Example environment file. Copy to `.env` and update secrets as needed.

Quick start

1. Copy the example env:

```powershell
Copy-Item -Path .env.example -Destination .env -ErrorAction SilentlyContinue
```

Or on Unix:

```bash
cp .env.example .env
```

2. If the images are private, log in to Docker Hub:

```bash
docker login
```

3. Pull the images and start the stack:

```bash
docker-compose pull
```powershell
Copy-Item -Path .env.example -Destination .env -ErrorAction SilentlyContinue
docker-compose pull
docker-compose up -d 
```

```bash
cp .env.example .env
docker-compose pull
docker-compose up -d
```
