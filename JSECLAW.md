# JSEclaw Fork Plan

This repository is the initial fork of `openclaw/openclaw` for Eric's custom distro: **JSEclaw**.

## Phase 1 (now)
- Fork created under `Ericnussa/JSEclaw`
- Local clone initialized with upstream remote
- Initial branding marker added in README title

## Phase 2 (in progress)
- ✅ Added `jseclaw` npm package name + metadata pointing to `Ericnussa/JSEclaw`
- ✅ Added `jseclaw` CLI binary (compatibility wrapper), while keeping `openclaw` binary intact
- ✅ Added `npm run jseclaw` and `npm run jseclaw:rpc` aliases
- ⏳ Add `JSECLAW_BRAND.md` with voice/default UX changes
- ⏳ Add VPS-first install and deploy docs
- ⏳ Set up release channel/tags for JSEclaw

## Upstream Sync Strategy
- Keep `upstream` remote pointing to `openclaw/openclaw`
- Regularly rebase/merge upstream `main`
- Keep custom patches isolated in JSEclaw-specific commits
