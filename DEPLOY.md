# DEPLOY.md — one-time setup for slides.tstephen.com

This is the standard **static-project recipe** (files served directly; deploy =
`git pull`; nothing to build or restart) — the same one used for www.tstephen.com.
Do **not** copy the COMPOSE variant (PocketBase backend behind `reverse_proxy`, a
build step, and a systemd restart in its deploy script) — this repo has no
server-side state.

## 0. The secret

Use the `DEPLOY_SSH_KEY` value from the **slides** repo (the `gha-slides`
key, provisioned & proven 2026-07-11) — not any older copy.

## 1. DNS (Porkbun) — do this BEFORE the Caddy block

Add an A record: `teaching` → `167.233.233.109`.

Caddy issues the TLS certificate on first load of the site block; if the DNS record
isn't live yet, **certificate issuance fails**.

## 2. VPS (as root)

```sh
git clone <repo-url> /srv/slides
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

## 3. GitHub repo settings

- **Deploy key with write access** — so Cowork can push to the repo.
- **Actions secret `DEPLOY_SSH_KEY`** — the base64-encoded private key for
  `compose@167.233.233.109`. Use the **same base64 value as the compose repo's
  secret**: it's a *server* credential, not a repo credential, so sharing it across
  repos is fine.

Why base64? PowerShell mangles multi-line secrets when pasting ("error in
libcrypto"), so the workflow stores the key base64-encoded and decodes it at run
time.

## 4. The workflow

`.github/workflows/deploy.yml` in this repo is a template written from the working
recipe. **It is the battle-tested version from the slides repo** (base64-decode with
raw fallback), already in place.

On every push to `main` it SSHes in as `compose@167.233.233.109` and runs:

```sh
git -C /srv/slides fetch origin main && git -C /srv/slides reset --hard origin/main
```

## 5. Verify

Push a trivial change to `main`, watch the run under the repo's **Actions** tab,
then hard-refresh https://slides.tstephen.com.

## Ongoing workflow

Edit locally in Cowork / Claude Code → commit → push to `main` → Actions deploys.
No restarts, no build. If the site looks stale: check the latest Actions run first
(a red run almost always means the `DEPLOY_SSH_KEY` secret).
