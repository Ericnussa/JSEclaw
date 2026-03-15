# Install JSEBot on Kali Linux

**Copy-paste, answer questions, done. 3 minutes.**

---

## Step 1: Update Your System

Open **Terminal** and copy/paste this:

```bash
sudo apt update && sudo apt upgrade -y
```

Press Enter. Wait for it to finish.

---

## Step 2: Install Node.js (One-time)

Copy/paste this:

```bash
sudo apt install -y nodejs npm
```

Press Enter and wait. You'll see:

```
✅ done.
```

### Verify it worked:

```bash
node --version
```

Should show `v22.x.x` or higher.

---

## Step 3: Install JSEBot (Copy & Paste)

Copy/paste this:

```bash
npm install -g jsebot
```

Press Enter and wait. You'll see:

```
✨ added 250 packages in 12s
```

Done! ✅

---

## Step 4: Set It Up

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

Use **Arrow Keys**, press **Enter** to pick.

### Quick Setup

1. **"Where do you want to chat?"** → Pick your app
2. **"What should I call you?"** → Type your name, press Enter
3. **"Preferred language?"** → Pick English or your language
4. **"Install as background service?"** → Type `y`, press Enter

Done:

```
✅ Setup Complete!
Ready to chat on WhatsApp
```

---

## Step 5: Start Chatting

Type:

```bash
jsebot
```

You'll see:

```
>
```

Ask a question:

```
> What time is it?
```

Press Enter. JSEBot answers instantly.

**🎉 Done!**

---

## Using It Later

Just open Terminal and type:

```bash
jsebot
```

---

## Troubleshooting

### "command not found"

Close Terminal and open a new one. Try again.

If still doesn't work:

```bash
npm install -g jsebot
```

---

### "Permission denied"

Try:

```bash
sudo npm install -g jsebot
```

(Type your password if prompted)

---

### "Node.js too old"

Check version:

```bash
node --version
```

If it's v20 or lower, upgrade:

```bash
sudo apt remove nodejs npm
sudo apt update
sudo apt install -y nodejs npm
```

---

## What's Next?

Try:

- "What's the weather?"
- "Tell me a joke"
- "Calculate 50% of 200"
- "Set a reminder"

Enjoy! 🚀

---

## Need Help?

- **Advanced setup?** See [README.md](README.md)
- **Stuck?** Join our [Discord](https://discord.gg/jsebot)

---

**Happy chatting!** 💙
