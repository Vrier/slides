# DEPLOY.md — one-time setup for slides.tstephen.com

Standard **static-project recipe** (files served directly; deploy = `git
pull`; nothing to build or restart) — same as www and teaching. Not the
COMPOSE variant (no backend, no reverse_proxy, no restarts here).

## 1. DNS (Porkbun) — BEFORE the Caddy block

Add an A record: `slides` → `167.233.233.109`.
Caddy issues the TLS cert on first load of the site block; if DNS isn't live
yet, **certificate issuance fails**.

## 2. GitHub repo

Create `github.com/Vrier/slides` (empty — no README/license), then:

- **Settings → Deploy keys → Add**: the contents of `.deploy-key.pub` from
  this repo, **WITH write access** (this is how Cowork pushes). Deploy keys
  are unique per repo — never reuse across repos.
- **Settings → Secrets and variables → Actions**: secret `DEPLOY_SSH_KEY` =
  the same base64-encoded value as in the compose/teaching repos (the VPS
  credential — shareable). The workflow base64-decodes it, falling back to
  raw.

## 3. VPS (as root, after the repo has its first push)

```sh
git clone https://github.com/Vrier/slides /srv/slides
chown -R compose:compose /srv/slides
```

Append to the Caddyfile:

```
slides.tstephen.com {
    root * /srv/slides
    file_server
    encode gzip
}
```

Then:

```sh
systemctl reload caddy
```

## 4. Verify

Push a trivial change to `main`, watch the run under **Actions**, then:

```sh
curl -sI https://slides.tstephen.com/
curl -sI https://slides.tstephen.com/2026/demo/
```

Both should return `200` with the fresh content.

## Ongoing

Edit in Cowork / Claude Code → `npm test` → commit → push `main` → Actions
deploys. Site stale? Check the latest Actions run first (a red run almost
always means the `DEPLOY_SSH_KEY` secret).
