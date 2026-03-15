# 📥 Installing JSEBot on Kali Linux

Kali Linux has some specific quirks with npm and permissions. This guide covers the gotchas.

---

## Prerequisites

**Kali comes with Node.js, but verify it's current:**

```bash
node --version  # Should be ≥22
npm --version
```

**If you see an old version (e.g., Node 16):**

```bash
# Update Node.js via nvm (recommended on Kali)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
```

---

## Installation (Choose One)

### Option 1: Global Install with --prefix (Recommended for Kali)

Kali's npm global permissions can be tricky. Use `--prefix` to install in your home:

```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

**Then add this to your shell profile** (`~/.bashrc` or `~/.zshrc`):

```bash
export PATH="$HOME/.npm-global/bin:$PATH"
```

**Now install JSEBot:**

```bash
npm install -g jsebot
```

**Verify:**

```bash
jsebot --version
```

---

### Option 2: Use sudo (Quick but Less Ideal)

If Option 1 is too much setup:

```bash
sudo npm install -g jsebot
```

Then verify:

```bash
jsebot --version
```

---

### Option 3: Docker (No npm Hassles)

If you have Docker installed:

```bash
docker run -it --rm -v ~/.jsebot:/root/.jsebot \
  ericnussa/jsebot:latest \
  jsebot onboard
```

---

## Verify Installation

```bash
jsebot --version
```

Should output: `JSEBot vX.X.X`

---

## Common Kali Issues & Fixes

### ❌ "Permission denied" or "EACCES" error

**Problem:** npm lacks write permissions.

**Fix (use Option 1 above):**

```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
npm install -g jsebot
```

---

### ❌ "jsebot: command not found" after install

**Problem:** npm installed it, but it's not in your PATH.

**Check if it's in npm's global bin:**

```bash
ls ~/.npm-global/bin/jsebot
```

If it exists:

```bash
# Add to PATH temporarily
export PATH="$HOME/.npm-global/bin:$PATH"
jsebot --version
```

Then **permanently** add this line to `~/.bashrc`:

```bash
export PATH="$HOME/.npm-global/bin:$PATH"
```

Reload your shell:

```bash
source ~/.bashrc
```

---

### ❌ "Node.js version is too old"

**Problem:** Kali's default Node might be v16 or older.

**Fix:** Use nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
npm install -g jsebot
```

---

### ❌ Gateway won't start ("Port already in use")

**Problem:** Something else is using port 18789.

**Fix:**

```bash
# Find what's using the port
sudo lsof -i :18789

# Kill it
sudo kill -9 <PID>

# Then start JSEBot gateway
jsebot gateway --port 18789
```

Or use a different port:

```bash
jsebot gateway --port 28789
```

---

## Next Steps

1. **Run onboarding:**

   ```bash
   jsebot onboard --install-daemon
   ```

2. **Check Quick Start:**

   ```bash
   cat QUICK-START.md
   ```

3. **Troubleshooting:**
   ```bash
   jsebot doctor
   ```

---

## Still Stuck?

- **GitHub Issues:** [github.com/Ericnussa/JSEclaw/issues](https://github.com/Ericnussa/JSEclaw/issues)
- **General Troubleshooting:** [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- **Check gateway logs:** `jsebot logs --follow`

---

**You got this!** 🎯
