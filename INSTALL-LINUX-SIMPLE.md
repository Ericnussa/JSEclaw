# Install JSEBot on Linux

**Copy-paste, answer questions, done. 3 minutes.**

Works on Ubuntu, Debian, Fedora, and most Linux distros.

---

## Step 1: Install Node.js (One-time)

Open **Terminal** and copy/paste this:

```bash
sudo apt update && sudo apt install -y nodejs npm
```

For Fedora/RHEL:

```bash
sudo dnf install -y nodejs npm
```

Press Enter. Wait for it to finish. You'll see:

```
✅ done.
```

### Verify it worked:

```bash
node --version
```

Should show `v22.x.x` or higher. If it's older (v20 or lower), you need a newer version. Ask in our [Discord](https://discord.gg/jsebot).

---

## Step 2: Install JSEBot (Copy & Paste)

In that same Terminal, copy/paste this:

```bash
npm install -g jsebot
```

Press Enter and wait. You'll see:

```
✨ added 250 packages in 12s
```

Done! ✅

---

## Step 3: Set It Up

Tell JSEBot where you want to chat:

```bash
jsebot onboard
```

You'll see:

```
╔════════════════════════════════════════╗
║  Welcome to JSEBot Setup!              ║
║  Just answer a few quick questions     ║
╚════════════════════════════════════════╝

? Where do you want to chat? (Use arrow keys)
❯ WhatsApp
  Telegram
  Slack
  Discord
  More options...
```

Use **Arrow Keys** to pick an option, press **Enter**.

### Questions the Wizard Will Ask

1. **"Where do you want to chat?"** → Pick your favorite app
2. **"What should I call you?"** → Type your name, press Enter
3. **"Preferred language?"** → Pick English or your language
4. **"Install as background service?"** → Type `y`, press Enter

When done:

```
✅ Setup Complete!
Ready to chat on WhatsApp
```

---

## Step 4: Start Chatting

In Terminal, type:

```bash
jsebot
```

You'll see:

```
>
```

Type a question:

```
> What time is it?
```

Press Enter. JSEBot responds instantly.

**🎉 You're done!**

---

## Using It Later

Just open Terminal and type:

```bash
jsebot
```

That's it.

---

## Troubleshooting

### "command not found" (for node, npm, or jsebot)

Usually means the install didn't complete.

**Fix:**

1. Close Terminal completely
2. Open a new Terminal
3. Try the command again

If still doesn't work:

```bash
npm install -g jsebot
```

---

### "Permission denied"

If you see `EACCES: permission denied`, try:

```bash
sudo npm install -g jsebot
```

(It might ask for your password — type it and press Enter)

---

### "Node.js is too old"

If `node --version` shows v20 or lower, you need a newer version:

```bash
sudo apt remove nodejs npm
sudo apt update
sudo apt install -y nodejs npm
```

Then check: `node --version` (should be v22+)

---

### "Setup wizard keeps crashing"

Try running with sudo:

```bash
sudo jsebot onboard
```

Or check your Node version: `node --version` (must be v22+)

---

## What's Next?

Try asking JSEBot:

- "What's the weather?"
- "Tell me a joke"
- "What's 25% of 1000?"
- "Remind me tomorrow at 8am"

Enjoy! 🚀

---

## Need More Help?

- **Advanced setup?** See [README.md](README.md)
- **Still stuck?** Join our [Discord](https://discord.gg/jsebot)

---

**Happy chatting!** 💙
