# NPM Publishing Guide for JSEBot

**Last Updated:** March 15, 2026  
**Author:** Eric (@Ericnussa)  
**Status:** Production-Ready

---

## Quick Start

```bash
# 1. Verify everything is ready
npm run release:check

# 2. Bump version in package.json
# Example: 0.5.0 → 0.6.0 (follow semver)
# Then commit:
git add package.json
git commit -m "chore: release v0.6.0"

# 3. Create and push tag
git tag v0.6.0
git push origin v0.6.0

# GitHub Actions (publish-npm.yml) will:
# ✅ Run tests & linting
# ✅ Build the package
# ✅ Publish to npm (via Trusted Publishing)
# ✅ Create GitHub Release
```

Done! 🎉 Releases are **automated** via GitHub Actions.

---

## Table of Contents

1. [Pre-Publish Checklist](#pre-publish-checklist)
2. [Version Bumping (Semantic Versioning)](#version-bumping-semantic-versioning)
3. [Local Publishing (Manual)](#local-publishing-manual)
4. [GitHub Actions Publishing (Automated)](#github-actions-publishing-automated)
5. [NPM Registry Details](#npm-registry-details)
6. [Trusted Publishing Setup](#trusted-publishing-setup)
7. [Security Checklist](#security-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Publish Checklist

### Before every release, verify:

```bash
# 1. Clean git state (no uncommitted changes)
git status
# Should show: "On branch main\nnothing to commit, working tree clean"

# 2. All tests pass
pnpm test

# 3. Linting passes
pnpm lint
pnpm check

# 4. Build succeeds
pnpm build && pnpm ui:build

# 5. Package.json is valid
npm ls > /dev/null 2>&1 && echo "✅ package.json valid"

# 6. No security vulnerabilities
npm audit --audit-level=moderate

# 7. Check npm publish readiness (no upload, just validate)
npm publish --dry-run --access public
```

### Document Checks

```bash
# Verify critical docs exist:
- [ ] README.md (up-to-date)
- [ ] CHANGELOG.md (latest version documented)
- [ ] CONTRIBUTING.md (contribution guidelines)
- [ ] LICENSE (MIT license file)
- [ ] docs/GETTING-STARTED.md
- [ ] docs/DEPLOYMENT.md
- [ ] .npmignore (correct files excluded)
```

### Code Quality

```bash
# Check for dead code / unused exports
pnpm deadcode:report

# Verify no console.error/console.warn in production code
grep -r "console\.\(error\|warn\)" src/ || echo "✅ No debug logs"

# Check dependency security
npm audit
npm audit fix --dry-run
```

---

## Version Bumping (Semantic Versioning)

JSEBot uses **Semantic Versioning (semver)** with the format: `MAJOR.MINOR.PATCH`

### Versioning Rules

| Version   | When to Bump                               | Example           |
| --------- | ------------------------------------------ | ----------------- |
| **MAJOR** | Breaking changes, incompatible API updates | `0.5.0` → `1.0.0` |
| **MINOR** | New features, backward-compatible          | `0.5.0` → `0.6.0` |
| **PATCH** | Bug fixes, security patches                | `0.5.0` → `0.5.1` |

### Phase Timeline

```
Phase 1 (Logo & Icons)         → v0.1.0 (2026-03-12)
Phase 2 (Splash Screens)       → v0.2.0 (2026-03-14)
Phase 3 (Rubi Avatar)          → v0.3.0 (2026-03-15)
Phase 4 (Docs & Web)           → v0.4.0 (2026-03-15)
Phase 5 (Package Metadata)     → v0.5.0 (2026-03-15)
Phase 6 (Community & Skills)   → v0.6.0 (Q2 2026)
Phase 7 (Production Release)   → v1.0.0 (Q2 2026)
```

### How to Bump Version

```bash
# 1. Edit package.json
vim package.json
# Change "version": "0.5.0" to "0.6.0"

# 2. Update CHANGELOG.md with new version section at top
vim CHANGELOG.md
# Add:
# ## 0.6.0 (2026-03-20)
# ### Added
# - ...
# ### Changed
# - ...

# 3. Commit
git add package.json CHANGELOG.md
git commit -m "chore(release): v0.6.0"

# 4. Tag
git tag v0.6.0
git push origin main
git push origin v0.6.0

# GitHub Actions automatically publishes on tag push
```

---

## Local Publishing (Manual)

**⚠️ Not recommended for production releases.** Use GitHub Actions instead.

### Setup NPM Authentication

```bash
# Login to npm (one-time)
npm login
# Enter: username, password, email

# Verify login
npm whoami
# Should output your npm username
```

### Manual Publish Steps

```bash
# 1. Verify all checks pass
pnpm test && pnpm build

# 2. Dry-run (no actual publish)
npm publish --dry-run --access public

# 3. Actual publish (if dry-run succeeds)
npm publish --access public --access public --tag latest

# 4. Verify on npm registry
npm view jsebot
```

### One-Time Pad Token (Legacy, Not Recommended)

If you must use token auth:

```bash
# Generate token on https://www.npmjs.com/settings/~/tokens
# Create "Automation" token (for CI/CD)

# Add to ~/.npmrc
echo "//registry.npmjs.org/:_authToken=npm_xxxxxxxxxxxxx" >> ~/.npmrc
chmod 600 ~/.npmrc

# Then publish as normal
npm publish --access public
```

**⚠️ Never commit tokens to git. Use GitHub Secrets + Trusted Publishing instead.**

---

## GitHub Actions Publishing (Automated)

This is the **recommended approach**. Releases are automated via `.github/workflows/publish-npm.yml`.

### Workflow: On Tag Push

```bash
# 1. Update version in package.json + CHANGELOG.md
git add package.json CHANGELOG.md
git commit -m "chore(release): v0.6.0"

# 2. Create git tag
git tag v0.6.0

# 3. Push to GitHub
git push origin main
git push origin v0.6.0

# 4. GitHub Actions Workflow Executes:
#    ✅ Checkout code
#    ✅ Setup Node + pnpm
#    ✅ Install dependencies
#    ✅ Build (pnpm build && pnpm ui:build)
#    ✅ Publish to npm (Trusted Publishing)
#    ✅ Create GitHub Release
```

### Workflow Details

```yaml
# File: .github/workflows/publish-npm.yml
name: Publish to npm (Trusted Publishing)

on:
  push:
    tags:
      - 'v*'              # Triggers on v0.5.0, v1.0.0, etc.
  workflow_dispatch      # Manual trigger from GitHub UI

permissions:
  contents: read
  id-token: write        # Required for Trusted Publishing

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node v22 + pnpm v10.23.0
      - Install dependencies (frozen lockfile)
      - Build: pnpm build && pnpm ui:build
      - Publish: npm publish --access public --provenance --ignore-scripts
```

### Monitor Workflow

```bash
# Check status in GitHub UI
# → https://github.com/Ericnussa/JSEclaw/actions

# Or use gh CLI
gh run list --workflow=publish-npm.yml
gh run view <RUN_ID>
gh run view <RUN_ID> --log
```

---

## NPM Registry Details

### Package Information

| Field            | Value                                    |
| ---------------- | ---------------------------------------- |
| **Package Name** | `jsebot`                                 |
| **Scope**        | `@jsebot` (optional, currently unscoped) |
| **Registry URL** | https://registry.npmjs.org               |
| **npm Page**     | https://www.npmjs.com/package/jsebot     |
| **Access**       | Public (anyone can install)              |
| **License**      | MIT                                      |
| **Author**       | Eric Ezequiel Nussa (@Ericnussa)         |

### package.json Configuration

```json
{
  "name": "jsebot",
  "version": "0.5.0",
  "description": "JSEBot: personal AI assistant & SDK",
  "license": "MIT",
  "author": {
    "name": "Eric Ezequiel Nussa Caraballo",
    "email": "rubi.jse@gmail.com",
    "url": "https://github.com/Ericnussa"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Ericnussa/JSEclaw.git"
  },
  "bugs": {
    "url": "https://github.com/Ericnussa/JSEclaw/issues"
  },
  "homepage": "https://github.com/Ericnussa/JSEclaw#readme",
  "engines": {
    "node": ">=22.0.0"
  },
  "type": "module",
  "main": "dist/index.js",
  "bin": {
    "jsebot": "jsebot.mjs",
    "openclaw": "openclaw.mjs"
  }
}
```

---

## Trusted Publishing Setup

JSEBot uses **Trusted Publishing** (recommended, more secure).

### What is Trusted Publishing?

- ✅ No API tokens stored in secrets
- ✅ Uses GitHub OIDC token (temporary, auto-rotated)
- ✅ Binds release to specific GitHub Actions workflow + repo
- ✅ No risk of token leakage

### Configuration

#### npm.js Configuration (One-time)

1. Go to https://www.npmjs.com/settings/~
2. Click **Access Tokens** → **Generate New Token**
3. Leave **Configuration** empty (for Trusted Publishing, npm auto-configures)
4. Save token ID for reference only

#### GitHub Actions Configuration

The workflow already includes:

```yaml
permissions:
  contents: read
  id-token: write # Required for OIDC
```

When tag is pushed:

1. GitHub generates OIDC token
2. npm trusts it (no credentials needed)
3. Publish completes automatically

---

## Security Checklist

### Pre-Release Security

- [ ] Run `npm audit` — no moderate/high vulnerabilities
- [ ] Run `npm audit fix` if needed, re-test
- [ ] Verify dependencies are pinned (no caret/tilde ranges in critical deps)
- [ ] Check for secrets in code: `git log -p --all -S 'password\|token\|secret' | grep -i secret`
- [ ] Review recent dependency updates for CVEs
- [ ] Check `.npmignore` excludes `.env`, `.secrets/`, and sensitive files

### Release Process Security

- [ ] Tag is signed: `git tag -s v0.6.0 -m "Release v0.6.0"`
- [ ] Tag is pushed to GitHub: `git push origin v0.6.0`
- [ ] Trusted Publishing is configured (no API tokens in secrets)
- [ ] Workflow permissions include `id-token: write`
- [ ] No hardcoded secrets in `.github/workflows/publish-npm.yml`

### Post-Release Security

- [ ] Verify published package: `npm view jsebot@0.6.0`
- [ ] Download and test: `npm install jsebot@0.6.0 -g --dry-run`
- [ ] Check GitHub Release shows correct version
- [ ] Monitor for security issues: https://snyk.io/vulnerability-scanner

---

## Troubleshooting

### Issue: `npm publish --dry-run` fails

**Solution:**

```bash
# Check npm login status
npm whoami

# If not logged in, login
npm login

# Verify package.json
npm ls

# Check registry connectivity
npm ping
```

### Issue: GitHub Actions workflow fails on build

**Solution:**

```bash
# Manually run build locally
pnpm install --frozen-lockfile
pnpm build
pnpm ui:build

# Check for TypeScript errors
pnpm check

# Check for lint errors
pnpm lint
```

### Issue: Version already published to npm

**Solution:**

1. Bump version (major/minor/patch)
2. Update CHANGELOG.md
3. Create new tag: `git tag v0.5.1`
4. Push: `git push origin v0.5.1`

### Issue: Tag pushed but workflow didn't run

**Solution:**

```bash
# Verify tag format matches pattern
git tag -l | grep v

# Re-push tag
git push --force origin v0.6.0

# Check workflow status in GitHub UI
# → Settings → Actions → General → Workflow permissions
# → Ensure "Read and write permissions" is set
```

### Issue: npm publish says "You do not have permission"

**Solution:**

- Verify npm account has publish rights: `npm owner ls jsebot`
- Ensure GitHub OIDC is configured: https://docs.npmjs.com/creating-and-viewing-access-tokens
- Re-authenticate: `npm logout && npm login`

---

## Manual Rollback (If Needed)

If a bad release is published, you can unpublish (within 72 hours):

```bash
# Unpublish entire version
npm unpublish jsebot@0.6.0

# Or deprecate it (recommended instead of unpublish)
npm deprecate jsebot@0.6.0 "Use v0.6.1 instead"
```

**Then:**

1. Fix the issue locally
2. Bump version (e.g., 0.6.1)
3. Re-publish

---

## References

- **npm Trusted Publishing:** https://docs.npmjs.com/creating-and-viewing-access-tokens
- **Semantic Versioning:** https://semver.org/
- **npm Publish:** https://docs.npmjs.com/cli/publish
- **GitHub Actions:** https://docs.github.com/en/actions
- **JSEBot Repository:** https://github.com/Ericnussa/JSEclaw
- **JSEBot npm:** https://www.npmjs.com/package/jsebot

---

## Contact & Support

- **Questions?** Open an issue: https://github.com/Ericnussa/JSEclaw/issues
- **Discussions:** https://github.com/Ericnussa/JSEclaw/discussions
- **Email:** rubi.jse@gmail.com
- **Discord:** https://discord.gg/jsebot

---

**Made with ❤️ by Eric (@Ericnussa) and the JSEBot Team**
