# ⚡ Quick Start: Your First 5 Minutes with JSEBot

**New here?** You're in the right place. This guide will get you chatting with JSEBot in less than 5 minutes — no configuration needed.

---

## Timeline

- **0:00 - 0:30** — Install JSEBot
- **0:30 - 1:00** — Verify it works
- **1:00 - 5:00** — Chat with your AI assistant!

---

## Step 1: Install JSEBot (30 seconds)

Open your terminal and paste this:

```bash
npm install -g jsebot && jsebot onboard
```

**What it does:**

- Downloads JSEBot and its dependencies
- Starts the onboarding wizard
- Walks you through setup

See stuck? Jump to [INSTALL.md](INSTALL.md) for detailed help.

---

## Step 2: Answer a Few Questions (1-2 minutes)

The onboarding wizard will ask:

### Q1: "How do you want to communicate?"

**Your answer:** Pick one or more:

- **WhatsApp** — Chat from your phone (easiest for most people)
- **Telegram** — Quick and lightweight
- **Slack** — If you use Slack for work
- **Discord** — If you're in Discord communities
- _Others_ — iMessage, Google Chat, Signal, etc.

**First time?** Pick **WhatsApp**. It's the easiest.

### Q2: "Which AI model do you want to use?"

**Your answer:** Pick one:

- **Claude (Anthropic)** — Best for thinking through problems
- **GPT-4 (OpenAI)** — Great all-rounder
- **Local Model** — If you want everything private (advanced)

**First time?** Pick **Claude**. You'll need an API key (free tier available at https://console.anthropic.com).

### Q3: "Set a password"

Create a password for security. Something simple like `MyJSEBot2026` works fine.

### Q4: "Install as daemon?" (macOS/Linux only)

**Your answer:** Yes. This lets JSEBot run in the background automatically.

**Windows users:** You can enable this later.

---

## Step 3: Verify It Works (30 seconds)

Once onboarding completes, open a new terminal and type:

```bash
jsebot --version
```

**You should see:**

```
JSEBot v0.5.0
```

✅ **Success!** JSEBot is installed and ready.

---

## Step 4: Send Your First Message (1-2 minutes)

**On the communication channel you picked (WhatsApp, Telegram, etc.), message JSEBot:**

```
Hello JSEBot! What can you do?
```

**You should get a response like:**

```
Hi! I'm JSEBot, your personal AI assistant. I can:
- Answer questions
- Help with writing
- Automate tasks
- Control devices
... and more!
```

💬 **Congratulations!** You've sent your first message to an AI assistant running on _your_ computer, under _your_ control.

---

## Common Beginner Mistakes (How to Avoid Them)

### ❌ "I installed JSEBot but can't send messages"

**Why:** The gateway daemon isn't running.

**Fix:**

```bash
jsebot gateway --install-daemon
```

Then restart your terminal.

### ❌ "I get an API key error"

**Why:** You haven't set up your AI model's API key.

**Fix:**

```bash
jsebot agents add --name default
```

This will prompt you for your API key (from Anthropic, OpenAI, etc.).

### ❌ "Messages are delayed or not arriving"

**Why:** JSEBot's gateway is paused.

**Fix:**

```bash
jsebot gateway status
```

If it says "paused", restart it:

```bash
jsebot gateway start
```

### ❌ "Node.js not found"

**Why:** Node.js isn't installed or not in your PATH.

**Fix:**

- Restart your computer
- Reinstall Node.js from https://nodejs.org
- Use the LTS (Long-Term Support) version

---

## You're Ready! 🚀

You now have:

- ✅ JSEBot installed
- ✅ A channel configured (WhatsApp, Telegram, etc.)
- ✅ An AI model ready to chat
- ✅ Your first successful message sent

### Next Steps

**Want to do more?** Check out:

- [BEGINNER-GUIDE.md](docs/BEGINNER-GUIDE.md) — Full walkthrough with examples
- [docs/channels/](docs/channels/) — Add more channels (Discord, Slack, etc.)
- [docs/](docs/) — Advanced configuration and features
- [FAQ.md](docs/FAQ.md) — Answer to common questions

---

## Cheat Sheet

**Common Commands:**

```bash
# Check version
jsebot --version

# Start the gateway
jsebot gateway --install-daemon

# Send a message
jsebot message send --to "@username" --message "Hello!"

# View active channels
jsebot channels list

# Check gateway status
jsebot gateway status

# Stop the gateway
jsebot gateway stop

# View logs
jsebot logs --follow
```

---

## Need Help?

- **Installation stuck?** → [INSTALL.md](INSTALL.md)
- **Something broken?** → [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- **More questions?** → [FAQ.md](docs/FAQ.md)
- **Report a bug** → [GitHub Issues](https://github.com/Ericnussa/JSEclaw/issues)

---

**Welcome to JSEBot!** You're now part of a community using AI on their own terms. 🎉

Happy chatting! 💬
