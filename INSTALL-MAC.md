# Install JSEBot on Mac

**Copy-paste, answer questions, done. 3 minutes.**

---

## What You'll Need

A Mac (Intel or Apple Silicon). That's it.

---

## Step 1: Install Node.js (One-time only)

JSEBot needs Node.js to run. Think of it like the "engine" JSEBot runs on.

### Option A: Download & Install (Easiest)

1. Go to [nodejs.org](https://nodejs.org)
2. Click the **big green "LTS"** button (left side)
3. The installer downloads automatically
4. Double-click the **Node.js installer** file
5. Click **Continue** → **Agree** → **Install** → **Close**

That's it! Node.js is installed.

### Option B: Install with Homebrew (Power Users)

If you have Homebrew installed:

```bash
brew install node
```

### Option C: Verify It Worked

Open **Terminal** (Command-Space, type `terminal`, press Enter):

```bash
node --version
```

You should see:

```
v22.5.1
```

If it shows `v22.x.x` or higher, you're good! ✅

---

## Step 2: Install JSEBot (Copy & Paste)

In that same **Terminal** window, copy and paste this:

```bash
npm install -g jsebot
```

Press Enter and wait. You'll see:

```
✨ added 250 packages in 15s
```

Done! ✅

---

## Step 3: Set It Up

Now tell JSEBot where you want to chat:

```bash
jsebot onboard
```

Press Enter. You'll see:

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

Use **Arrow Keys** to pick an option, then press **Enter**.

### Questions the Wizard Will Ask

1. **"Where do you want to chat?"** → Pick your favorite app
2. **"What should I call you?"** → Type your name and press Enter
3. **"Preferred language?"** → Pick English or your language
4. **"Install as background service?"** → Type `y` and press Enter (recommended)

When done, you'll see:

```
✅ Setup Complete!
Ready to chat on WhatsApp
```

---

## Step 4: Start Chatting

In **Terminal**, type:

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

Press Enter. JSEBot responds:

```
It's 3:42 PM Eastern Time.
```

**🎉 You're done!**

---

## Using It Later

Next time you want to chat, just:

1. Open **Terminal** (Command-Space → `terminal` → Enter)
2. Type: `jsebot`
3. Start asking questions

---

## Pro Tip: Keep Terminal in Your Dock

1. Open Terminal
2. Right-click the Terminal icon in the Dock
3. Select "Keep in Dock"

Now you can open it anytime by clicking the icon.

---

## Troubleshooting

### "node: command not found"

Node.js didn't install properly.

**Fix:**

1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS** version for Mac
3. Run the installer again
4. Close Terminal and open a new one
5. Try: `node --version`

---

### "npm: command not found"

**Fix 1:**

```bash
npm install -g jsebot
```

Close Terminal and open a new one.

**Fix 2:**
If that doesn't work, restart your Mac and try again.

---

### "jsebot: command not found"

**Fix:**

```bash
npm install -g jsebot
```

Then close Terminal and open a new one. Try: `jsebot --version`

---

### "Setup wizard keeps crashing"

**Fix:** Make sure you have Node.js 22+:

```bash
node --version
```

Should show `v22.x.x` or higher. If it's older, get the latest from [nodejs.org](https://nodejs.org).

---

### "It asks for WhatsApp/Telegram authentication"

That's normal! Follow the wizard's instructions:

1. If it shows a QR code, scan it with your phone
2. Approve the connection in the app
3. Continue with setup

---

## What's Next?

Try asking JSEBot:

- "What's the weather in San Francisco?"
- "Tell me a joke"
- "Remind me tomorrow at 9am"
- "What's the definition of quantum entanglement?"

The more you chat, the smarter it gets. Enjoy! 🚀

---

## Need More Help?

- **Want to customize it?** See [Advanced Setup](README.md)
- **Still stuck?** Join our [Discord](https://discord.gg/jsebot)

---

**Happy chatting!** 💙
