# 📥 How to Install JSEBot

**New to JSEBot?** This guide is for you. No technical background required. We'll walk through everything step-by-step.

---

## What You'll Need

Before we start, make sure you have:

1. **A computer** — Mac, Windows, or Linux (even a Raspberry Pi!)
2. **Internet connection** — To download and run JSEBot
3. **10 minutes** — That's all it takes

That's it! You don't need to know how to code.

---

## What is Node.js?

**JSEBot needs Node.js to run.** Think of Node.js like the "engine" that makes JSEBot work.

**Simple explanation:** Just like a car needs an engine to run, JSEBot needs Node.js. When you install Node.js, you're giving your computer the ability to run JSEBot. It's a one-time setup — you install it once and forget about it.

**Is it safe?** Yes! Node.js is used by millions of developers and companies worldwide. It's free, open-source, and completely safe.

---

## Pick Your Installation Method

Choose the option that matches your comfort level:

### 🚀 **Option 1: Copy-Paste One Command (Easiest)**

If you're comfortable pasting commands in a terminal, this is the fastest way.

**Step 1: Open your terminal**

- **Mac:** Press `Cmd + Space`, type "Terminal", press Enter
- **Windows:** Press `Win + R`, type "powershell", press Enter
- **Linux:** Press `Ctrl + Alt + T` (or open your terminal app)

**Step 2: Copy and paste this command** (literally just highlight, copy, paste):

```bash
npm install -g jsebot && jsebot onboard
```

Then press **Enter**.

**What's happening?**

- `npm install -g jsebot` — Downloads and installs JSEBot globally (so you can use it from anywhere)
- `jsebot onboard` — Starts the setup wizard

**Step 3: Follow the onboarding wizard**

JSEBot will ask you a few questions:

- How do you want to communicate? (WhatsApp, Telegram, Slack, etc.)
- Which AI model do you want? (Claude, GPT, local model)
- Set up a password for security

**That's it! You're done.** ✅

---

### 💻 **Option 2: Manual npm Install (For Learners)**

Want to understand what's happening? This gives you more control.

**Step 1: Install Node.js First**

JSEBot needs Node.js (version 22 or newer).

**On Mac:**

```bash
# Using Homebrew (if installed)
brew install node

# OR download from https://nodejs.org (click the "LTS" button)
```

**On Windows:**

- Go to https://nodejs.org
- Click the big green "LTS" button
- Run the installer, click "Next" a few times, accept defaults
- Restart your computer

**On Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install nodejs npm
```

**Step 2: Verify Node.js is installed**

Open a terminal and type:

```bash
node --version
npm --version
```

You should see version numbers. If you see an error, Node.js isn't installed correctly yet.

**Step 3: Install JSEBot**

```bash
npm install -g jsebot
```

This tells npm (Node's package manager) to download and install JSEBot globally.

**Step 4: Start the onboarding**

```bash
jsebot onboard
```

Follow the prompts to set up channels, AI models, and security.

---

### 🐳 **Option 3: Docker (For Docker Users)**

If you already have Docker installed:

```bash
docker run -it --rm -v ~/.jsebot:/home/app/.jsebot jsebot:latest jsebot onboard
```

This runs JSEBot inside a container (totally isolated from your system).

**Note:** Docker is more advanced — only use this if you're already familiar with Docker.

---

## ✅ Verify Installation Worked

After installation, let's make sure everything is working:

**Open your terminal and type:**

```bash
jsebot --version
```

You should see something like:

```
JSEBot v0.5.0
```

**Great!** ✅ If you see the version number, JSEBot is installed and ready to use.

---

## Your First Message

**Let's test it by sending your first message:**

```bash
jsebot message send --to "@your-name" --message "Hello JSEBot! 🚀"
```

Replace `@your-name` with a real contact (WhatsApp number, Telegram handle, etc., depending on how you configured JSEBot).

**What should happen:**

- You receive your message
- JSEBot sends a reply
- You're now using AI assistance!

---

## 🆘 Troubleshooting

### "Node.js not found" or "npm not found"

**Problem:** The terminal doesn't recognize `node` or `npm`.

**Solution:**

1. Restart your terminal (close and reopen)
2. Restart your computer
3. If still broken, visit https://nodejs.org and reinstall

### "Permission denied" error

**Problem (Mac/Linux):** You get an error about permissions.

**Solution:**

```bash
# Add sudo before the npm command
sudo npm install -g jsebot
```

### "JSEBot command not found" after installation

**Problem:** You installed JSEBot but can't run it.

**Solution:**

1. **Restart your terminal** (close and reopen)
2. Type `npm list -g jsebot` to verify it's installed
3. If installed, try the full path:
   ```bash
   ~/.npm-global/bin/jsebot --version
   ```

### "Can't connect to channels" or "Network error"

**Problem:** JSEBot installed but can't reach WhatsApp, Telegram, etc.

**Solution:**

1. Check your internet connection
2. Make sure you set up channel credentials correctly during onboarding
3. Run `jsebot gateway --verbose` to see what's happening
4. Check GitHub issues: https://github.com/Ericnussa/JSEclaw/issues

---

## What Happens Next?

After successful installation:

1. **JSEBot is running** — It's listening for messages across all your configured channels
2. **You can chat** — Message it from WhatsApp, Telegram, Slack, etc.
3. **It responds** — Using the AI model you selected
4. **Customize later** — Modify config, add skills, control smart devices (advanced)

---

## Next Steps

- **Quick Start:** Read [QUICK-START.md](QUICK-START.md) for your first 5 minutes
- **Full Guide:** Check out [docs/BEGINNER-GUIDE.md](docs/BEGINNER-GUIDE.md)
- **Support:** Need help? Open an issue on [GitHub](https://github.com/Ericnussa/JSEclaw/issues)

---

## Advanced Options (Optional)

These are for power users. Beginners can skip this section.

### Install a Specific Version

```bash
npm install -g jsebot@0.5.0
```

### Update JSEBot

```bash
npm install -g jsebot@latest
```

### Uninstall JSEBot

```bash
npm uninstall -g jsebot
```

### View Installation Location

```bash
npm list -g jsebot
```

---

## Still Stuck?

- **GitHub Issues:** https://github.com/Ericnussa/JSEclaw/issues
- **Discussions:** https://github.com/Ericnussa/JSEclaw/discussions
- **Discord:** Join our community (link in README)

We're here to help! 🚀

---

**Happy to have you on board!** 🎉
