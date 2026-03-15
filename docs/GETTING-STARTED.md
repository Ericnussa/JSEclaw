# Getting Started with JSEBot

Welcome! This guide walks you through installing and configuring JSEBot from scratch.

**Estimated time:** 10-15 minutes

## 📋 Prerequisites

- **Node.js ≥22** — Download from [nodejs.org](https://nodejs.org)
- **npm or pnpm** — Comes with Node.js (or install pnpm: `npm i -g pnpm`)
- **macOS, Linux, or Windows (WSL2)** — See [Platform-Specific Setup](#platform-specific-setup)

### Check Your Setup

```bash
node --version    # Should be v22.0.0 or higher
npm --version     # Should be 10.0.0 or higher
```

If either version is too old, update Node.js before proceeding.

---

## 🚀 Installation (5 minutes)

### Step 1: Install JSEBot

```bash
npm install -g jsebot
```

**Verify installation:**

```bash
jsebot --version
# Should output: 2026.3.2 (or current version)
```

### Step 2: Run the Onboarding Wizard

```bash
jsebot onboard
```

The wizard is interactive and guides you through:

1. **Model Setup** — Choose your AI model (Anthropic recommended)
2. **Gateway Config** — Port and logging preferences
3. **Channel Setup** — Add WhatsApp, Telegram, Discord, etc. (optional)
4. **Daemon Installation** — Auto-start on login

**Pro tip:** The wizard saves everything to `~/.jsebot/` by default.

### Step 3: Verify Installation

```bash
jsebot doctor
```

This command checks your configuration and highlights any issues:

- ✅ Gateway reachable
- ✅ Model authentication working
- ✅ Channels configured
- ⚠️ Security warnings (if any)

---

## 🔧 Configuration (5 minutes)

All configuration happens in `~/.jsebot/config.yaml`. You can edit this manually or use the CLI.

### Important Settings

#### Model Selection

```yaml
# ~/.jsebot/config.yaml
models:
  default: claude-opus-4-1
  fallback: gpt-4-turbo

  anthropic:
    apiKey: ${ANTHROPIC_API_KEY}

  openai:
    apiKey: ${OPENAI_API_KEY}
```

**Recommended setup:**

```bash
# Set your API keys
export ANTHROPIC_API_KEY="sk-ant-..."
export OPENAI_API_KEY="sk-..."

# Then run onboard again if needed
jsebot onboard
```

#### Gateway Port

```yaml
gateway:
  port: 18789 # Default; change if in use
  host: localhost
  verbose: false # Set to true for debugging
```

#### Channels

Add messaging platforms:

```yaml
channels:
  discord:
    token: "YOUR_BOT_TOKEN"
    dmPolicy: "pairing" # pairing | open

  telegram:
    botToken: "YOUR_BOT_TOKEN"

  whatsapp:
    # Uses Baileys (WhatsApp Web)
    # First login will show a QR code
```

**See [Channels Guide](../docs/channels/) for each platform's setup.**

---

## ⚡ Quick Start Commands

### Start the Gateway

```bash
# As a daemon (background, auto-start on login)
jsebot gateway --install-daemon

# Or manually in the terminal
jsebot gateway --port 18789 --verbose
```

### Chat with the Assistant

```bash
# Quick question
jsebot agent --message "What's the current time?"

# Complex task (uses better model)
jsebot agent --message "Write a business plan" --thinking high

# With a file
jsebot agent --message "Summarize this" --file document.pdf

# Stream response (shows as it's generated)
jsebot agent --message "Tell me a story" --stream
```

### Send a Message

```bash
# To a specific user (requires channel config)
jsebot message send \
  --to "@john" \
  --message "Hey, how are you?" \
  --channel discord

# To a channel
jsebot message send \
  --to "#general" \
  --message "Morning everyone!" \
  --channel slack
```

### View Logs

```bash
# Gateway logs
jsebot gateway --logs

# Agent session logs
jsebot logs show main

# Filter by channel
jsebot logs show --filter discord
```

---

## 🎨 Your First Automation

Let's create your first automated workflow:

### Example 1: Daily Digest

```bash
# Create a cron job that runs every morning
jsebot cron add \
  --schedule "0 8 * * *" \
  --message "Summarize my calendar for today"
```

This runs every day at 8 AM and delivers the response to your default channel.

### Example 2: Channel Automation

```yaml
# Add to ~/.jsebot/config.yaml
automations:
  - name: "Morning briefing"
    schedule: "0 7 * * MON-FRI"
    trigger: "Give me a news briefing"
    channels: [discord, slack]
```

---

## 🔐 Security Basics

### DM Pairing (Recommended)

By default, unknown senders can't DM the bot. They must approve a pairing code first:

```bash
# Unknown person sends a DM:
# "I sent you a message!"

# They receive:
# "I don't know you yet! Send this code to approve: ABC123"

# Once they send the code to you, approve it:
jsebot pairing approve discord ABC123

# Now they can message the bot
```

**To allow anyone to DM (risky):**

```yaml
# ~/.jsebot/config.yaml
channels:
  discord:
    dmPolicy: "open" # Anyone can DM
    allowFrom: "*" # No allowlist
```

### Checking Dangerous Settings

```bash
jsebot doctor --security
```

This highlights:

- 🟡 Open DM policies
- 🟡 Weak authentication
- 🔴 Exposed secrets in config

---

## 📱 Connecting Channels

Channels let JSEBot respond on your favorite platforms.

### Discord

1. [Create an app](https://discord.com/developers/applications)
2. Copy the **Bot Token**
3. Add to your config:

```bash
jsebot channel add discord
# Prompts for: bot-token, server-id, etc.
```

### Telegram

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot (copy the token)
3. Add to your config:

```bash
jsebot channel add telegram
# Prompts for: bot-token
```

### WhatsApp

WhatsApp is trickier (no official bot API):

```bash
jsebot channel add whatsapp
# Scans a QR code to link your personal WhatsApp
```

**Note:** This requires WhatsApp Web to stay logged in.

### Slack

1. [Create a Slack app](https://api.slack.com/apps)
2. Get your **Bot User OAuth Token**
3. Add to your config:

```bash
jsebot channel add slack
# Prompts for: bot-token, workspace
```

See [Channels Guide](../docs/channels/) for all 20+ platforms.

---

## 🛠️ Troubleshooting

### "Gateway not reachable"

```bash
# Check if gateway is running
jsebot gateway --status

# Start it if not running
jsebot gateway --port 18789
```

### "Model authentication failed"

```bash
# Check your API keys
export ANTHROPIC_API_KEY="your-key-here"

# Re-run onboard
jsebot onboard
```

### "Channel not responding"

```bash
# Verify channel config
jsebot doctor --channel discord

# Check the logs
jsebot logs show --filter discord

# Try re-adding the channel
jsebot channel add discord
```

### "Port already in use"

```bash
# Find what's using port 18789
lsof -i :18789

# Use a different port
jsebot gateway --port 18790
```

**More help:** See [Troubleshooting Guide](TROUBLESHOOTING.md)

---

## 🎓 Next Steps

Now that you're set up:

1. **Explore Channels** — Add WhatsApp, Telegram, or Slack
2. **Learn Skills** — Install tools like weather, calendar, reminders
3. **Customize Agent** — Edit your agent's system prompt
4. **Read the Docs** — Check out [API Guide](API.md) and [Deployment Guide](DEPLOYMENT.md)
5. **Join Community** — Ask questions on [Discord](https://discord.gg/jsebot)

---

## 📚 Resources

- **[README](../README.md)** — Project overview
- **[CLI Guide](CLI.md)** — All commands with examples
- **[Channels Guide](../docs/channels/)** — Platform-specific setup
- **[Security Guide](../SECURITY.md)** — Privacy and security best practices
- **[Roadmap](../ROADMAP.md)** — What's coming next
- **[FAQ](../docs/FAQ.md)** — Common questions

---

## 💬 Getting Help

- **Issues:** [GitHub Issues](https://github.com/Ericnussa/JSEclaw/issues)
- **Questions:** [GitHub Discussions](https://github.com/Ericnussa/JSEclaw/discussions)
- **Chat:** [Discord Server](https://discord.gg/jsebot)
- **Email:** [hello@jsebot.dev](mailto:hello@jsebot.dev)

---

**Congratulations! You're ready to use JSEBot.** 🎉

Next, try adding a channel (Slack, Discord, etc.) and send your first message!
