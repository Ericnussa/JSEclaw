# Install JSEBot on Windows

**Copy-paste, answer questions, done. 3 minutes.**

---

## What You'll Need

A Windows computer with internet access. That's it.

---

## Step 1: Install Node.js (One-time only)

JSEBot needs Node.js to run. Think of it like the "engine" JSEBot runs on.

### Option A: Download & Install (Easiest)

1. Go to [nodejs.org](https://nodejs.org)
2. Click the **big green "LTS"** button (left side)
3. When it finishes downloading, double-click the installer
4. Click **Next** → **I Agree** → **Next** → **Install** → **Finish**

That's it! Node.js is installed.

### Option B: Verify It Worked

Open **Command Prompt**:

1. Press `Windows Key + R`
2. Type: `cmd`
3. Press Enter

You'll see:

```
C:\Users\YourName>
```

Now type this:

```
node --version
```

You should see something like:

```
v22.5.1
```

If it says `v22.x.x` or higher, you're good! ✅

If it says "node: command not found", close this window and restart your computer, then try again.

---

## Step 2: Install JSEBot (Copy & Paste)

In that same **Command Prompt** window, copy this and paste it:

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

Use your **Arrow Keys** to pick an option, then press **Enter**.

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

In **Command Prompt**, type:

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

1. Open **Command Prompt** (`Windows Key + R` → `cmd` → Enter)
2. Type: `jsebot`
3. Start typing your question

---

## Troubleshooting

### "npm: command not found"

Node.js didn't install properly.

**Fix:**

1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS** version
3. Run the installer again
4. **Restart your computer**
5. Try again: `npm install -g jsebot`

---

### "jsebot: command not found"

**Fix 1:**

```bash
npm install -g jsebot
```

Then close Command Prompt and open a new one.

**Fix 2:**
If that doesn't work, restart your computer and try again.

---

### "Setup wizard keeps crashing"

**Fix:** Make sure you have Node.js 22+:

```bash
node --version
```

Should show `v22.x.x` or higher. If it's older, download the latest from [nodejs.org](https://nodejs.org).

---

### "It asks for authentication"

If it asks for passwords/codes for WhatsApp/Telegram:

1. Follow the wizard's instructions (it's the normal login flow)
2. Scan the QR code with your phone if prompted
3. Approve the connection
4. Continue with setup

---

## What's Next?

Try asking JSEBot things like:

- "What's the weather?"
- "Tell me a joke"
- "Calculate 20% of 450"
- "Set a reminder for tomorrow"

The more you chat, the smarter it gets. Have fun! 🚀

---

## Need More Help?

- **Want to customize it?** See [Advanced Setup](README.md)
- **Still stuck?** Join our [Discord](https://discord.gg/jsebot)

---

**Happy chatting!** 💙
