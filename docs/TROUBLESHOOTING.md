# 🔧 Troubleshooting Guide

**Something not working?** Don't worry. Most issues have simple fixes. Start here.

---

## Installation & Setup Issues

### "npm: command not found"

**Problem:** Terminal doesn't recognize the `npm` command.

**Cause:** Node.js isn't installed or not in your PATH.

**Fix:**

1. **Verify Node.js is installed:**

   ```bash
   node --version
   ```

   If you see an error, Node.js isn't installed.

2. **Install Node.js:**
   - **Mac:** `brew install node` or visit https://nodejs.org
   - **Windows:** Download from https://nodejs.org (LTS version)
   - **Linux:** `sudo apt install nodejs npm`

3. **Restart your terminal** and try again.

4. **If still not working:**

   ```bash
   # Check where npm is installed
   which npm

   # If output is empty, reinstall Node.js
   # If output shows a path, add it to PATH (advanced)
   ```

---

### "Permission denied" when installing

**Problem:** You get a permission error during installation.

**Cause:** npm doesn't have write permissions.

**Fix (Mac/Linux):**

Option 1: Use sudo (simplest)

```bash
sudo npm install -g jsebot
```

Option 2: Fix npm permissions (recommended long-term)

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g jsebot
```

**Fix (Windows):**

1. Open PowerShell as Administrator
2. Run:
   ```powershell
   npm install -g jsebot
   ```

---

### "jsebot: command not found" after installation

**Problem:** You installed JSEBot but can't run it.

**Causes & Fixes:**

**1. Terminal hasn't reloaded**

```bash
# Close your terminal completely and reopen it
# Then try again
jsebot --version
```

**2. Node.js path issue**

```bash
# Try the full path
~/.npm-global/bin/jsebot --version

# If that works, add to PATH:
export PATH="$HOME/.npm-global/bin:$PATH"
```

**3. Actually not installed**

```bash
npm list -g jsebot

# If not installed, reinstall:
npm install -g jsebot
```

**4. Multiple Node.js versions**

```bash
# Check which npm is being used
which npm

# Make sure it's the one you expect
npm --version
```

---

### Onboarding wizard crashes or hangs

**Problem:** The setup wizard fails or gets stuck.

**Causes & Fixes:**

**1. Interrupted download**

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install -g jsebot
```

**2. Old cached files**

```bash
# Uninstall
npm uninstall -g jsebot

# Clear cache
npm cache clean --force

# Reinstall
npm install -g jsebot
```

**3. Terminal encoding issue**

```bash
# Try with verbose mode
jsebot onboard --verbose

# Check for error messages
```

---

## Gateway & Connection Issues

### "Gateway connection refused" or "Cannot connect"

**Problem:** JSEBot can't start or connect to the gateway.

**Check:**

```bash
# Is the gateway running?
jsebot gateway status

# Start the gateway
jsebot gateway start

# Or install as daemon (background)
jsebot gateway --install-daemon

# Check port 18789 is available
lsof -i :18789  # Mac/Linux
netstat -ano | findstr :18789  # Windows
```

**If port 18789 is in use:**

```bash
# Use a different port
jsebot gateway --port 19000
```

---

### "Channel not responding" or "Message sent but no reply"

**Problem:** You send a message but JSEBot doesn't respond.

**Causes & Fixes:**

**1. Gateway isn't running**

```bash
jsebot gateway status

# If it says "stopped" or "paused"
jsebot gateway start
```

**2. Channel disconnected**

```bash
# View all connected channels
jsebot channels list

# See which channels are online

# Reconnect if needed
jsebot channels reconnect --name whatsapp
```

**3. No AI model configured**

```bash
# Check agents
jsebot agents list

# Add an agent if none exist
jsebot agents add --name default
```

**4. API key invalid or expired**

```bash
# Remove old agent
jsebot agents remove --name default

# Add new agent with fresh API key
jsebot agents add --name default
```

---

### "Timeout" or "Slow responses"

**Problem:** Messages are taking 30+ seconds to respond.

**Causes & Fixes:**

**1. Using a slow model**

- **Opus/GPT-4** are slow (30-60 seconds)
- **Haiku/GPT-3.5** are faster (3-10 seconds)

Switch to a faster model in config.

**2. Network latency**

```bash
# Test connection
ping 8.8.8.8

# Check internet speed
# https://speedtest.net
```

**3. API service is overloaded**

- Wait a few minutes
- Try again
- Check service status: https://status.anthropic.com

**4. Gateway is overwhelmed**

```bash
# Check logs
jsebot logs --follow

# See if there are errors
```

---

## Channel-Specific Issues

### WhatsApp not connecting

**Problem:** WhatsApp channel won't authenticate.

**Fix:**

```bash
# Remove old WhatsApp config
jsebot channels remove --name whatsapp

# Reconnect (will show QR code)
jsebot channels add --name whatsapp

# Scan QR code with your phone
```

**If QR code doesn't appear:**

```bash
# Try with verbose mode
jsebot channels add --name whatsapp --verbose

# Check browser might be blocking
```

---

### Telegram token invalid

**Problem:** Telegram says "Invalid token" or "Not authorized".

**Fix:**

1. Get a fresh token from [@BotFather](https://t.me/BotFather)
   - Message: `/newtoken`
   - Select JSEBot
   - Copy new token

2. Remove old Telegram config:

   ```bash
   jsebot channels remove --name telegram
   ```

3. Add with new token:

   ```bash
   jsebot channels add --name telegram

   # Paste the new token
   ```

---

### Slack integration not working

**Problem:** Slack channel connected but not responding.

**Fix:**

```bash
# Check if Slack app is installed in workspace
# Go to: workspace.slack.com/apps/manage

# If not found, reinstall via JSEBot
jsebot channels remove --name slack
jsebot channels add --name slack

# Grant permissions when prompted
```

---

### Discord not seeing messages

**Problem:** Discord bot is in server but doesn't respond.

**Fix:**

```bash
# Check bot permissions
# Server Settings → Integrations → JSEBot

# Required permissions:
# ✅ Read Messages
# ✅ Send Messages
# ✅ Manage Messages (for reactions)

# If missing, re-invite bot with permissions
jsebot channels remove --name discord
jsebot channels add --name discord
```

---

## API & Model Issues

### "API key invalid" or "Authentication failed"

**Problem:** You get auth errors even with correct key.

**Causes & Fixes:**

**1. Key is wrong**

```bash
# Double-check your key at:
# Anthropic: https://console.anthropic.com
# OpenAI: https://platform.openai.com/account/api-keys
```

**2. Key is expired or revoked**

- Generate a new key
- Remove old agent: `jsebot agents remove --name default`
- Add new agent: `jsebot agents add --name default`

**3. Whitelist restrictions**

- Some accounts restrict IP addresses
- Check your provider's security settings

---

### "Quota exceeded" or "Rate limited"

**Problem:** Getting errors about too many requests.

**Causes & Fixes:**

**1. Too many messages in short time**

```bash
# Wait a few minutes
# Or upgrade your API tier at the provider
```

**2. Running out of credits**

- Check your account at Anthropic/OpenAI
- Add payment method
- Monitor usage regularly

**3. Hitting rate limits**

```bash
# Use a cheaper model (Haiku instead of Opus)
# Or add delays between messages
```

---

### "Model not found" or "Unsupported model"

**Problem:** Can't use a specific model name.

**Fix:**

```bash
# See available models
jsebot agents list

# Valid Claude models:
# - claude-3-opus-20250219 (smartest, slowest)
# - claude-3-sonnet-20250229 (balanced)
# - claude-3-haiku-20250307 (fastest, cheapest)

# Valid OpenAI models:
# - gpt-4-turbo
# - gpt-4
# - gpt-3.5-turbo (cheapest)
```

---

## Logs & Debugging

### How to check logs

**View recent logs:**

```bash
jsebot logs --lines 50
```

**Follow logs in real-time:**

```bash
jsebot logs --follow
```

**Save logs to file:**

```bash
jsebot logs > my-logs.txt
```

**Verbose mode (more details):**

```bash
jsebot gateway --verbose
```

---

### Understanding error messages

**Common error patterns:**

| Error                   | Meaning                  | Fix              |
| ----------------------- | ------------------------ | ---------------- |
| `ECONNREFUSED`          | Can't connect to gateway | Start gateway    |
| `ENOTFOUND`             | DNS/network problem      | Check internet   |
| `401 Unauthorized`      | Bad API key              | Update key       |
| `429 Too Many Requests` | Rate limited             | Wait or upgrade  |
| `TIMEOUT`               | Request took too long    | Use faster model |
| `Socket hang up`        | Connection lost          | Restart gateway  |

---

## Performance Issues

### JSEBot using too much CPU

**Problem:** JSEBot is hogging your processor.

**Fix:**

```bash
# Check what's running
jsebot processes

# Might be processing long documents
# Just wait for it to finish

# Or restart to clear
jsebot gateway restart
```

---

### JSEBot using too much memory

**Problem:** JSEBot is eating RAM.

**Fix:**

```bash
# Restart the gateway
jsebot gateway restart

# Check for memory leaks
jsebot logs --errors

# If persistent, report issue:
# https://github.com/Ericnussa/JSEclaw/issues
```

---

### Disk space issues

**Problem:** JSEBot filling up your disk.

**Find large files:**

```bash
# On Mac/Linux
du -sh ~/.jsebot/*

# On Windows
dir %AppData%\jsebot /s /d
```

**Safe to delete:**

- `~/.jsebot/cache/` — Temporary cache (can rebuild)
- Old log files in `~/.jsebot/logs/`

**Don't delete:**

- `~/.jsebot/config.json` — Your configuration
- `~/.jsebot/workspace/` — Your workspace data

---

## Still Not Working?

### Before reporting an issue

1. **Restart everything:**

   ```bash
   jsebot gateway stop
   jsebot gateway start
   ```

2. **Check logs:**

   ```bash
   jsebot logs --lines 100 > logs.txt
   ```

3. **Try the latest version:**

   ```bash
   npm install -g jsebot@latest
   ```

4. **Reset (careful!):**

   ```bash
   # Backup first!
   cp -r ~/.jsebot ~/.jsebot.backup

   # Reset
   jsebot onboard --reset
   ```

### Report a bug

**Go to:** https://github.com/Ericnussa/JSEclaw/issues/new

**Include:**

- What you were trying to do
- Error message (exact text)
- Output of `jsebot logs --lines 50`
- Your OS and Node.js version (`node --version`)

**Example:**

```
Title: WhatsApp channel disconnects after 10 minutes

Steps to reproduce:
1. Run `jsebot channels add --name whatsapp`
2. Connect via QR code
3. Wait 10 minutes without sending messages
4. Send a message

Expected: Message sends normally
Actual: Get timeout error

Logs: [paste here]
OS: macOS 14.2
Node.js: v22.0.0
```

---

### Get community help

- **GitHub Discussions:** https://github.com/Ericnussa/JSEclaw/discussions
- **Discord Server:** [Link in README]
- **Email:** [Support email]

---

## Advanced Debugging

### Enable debug mode

```bash
DEBUG=* jsebot gateway --verbose
```

### Check system requirements

```bash
# Node.js version
node --version

# npm version
npm --version

# Disk space
df -h /

# Memory available
free -h  # Linux
vm_stat  # Mac
```

### Network diagnostics

```bash
# Test internet
ping 1.1.1.1

# Check DNS
nslookup anthropic.com

# Check API endpoint
curl https://api.anthropic.com/health
```

---

## You're Not Alone

Thousands of people use JSEBot. If you hit a problem, likely someone else has too and there's a solution. Don't give up!

**Next steps:**

1. Try the fixes above
2. Check GitHub issues
3. Ask in Discord
4. Report a new issue if needed

---

**We're here to help.** 🚀
