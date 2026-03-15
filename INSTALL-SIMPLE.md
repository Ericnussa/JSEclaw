# Install JSEBot (Easy Version)

**This takes 2 minutes. Just copy and paste each command.**

No technical knowledge needed. We'll walk you through it step-by-step.

---

## Step 1: Install (Copy this exactly)

First, open your Terminal (Mac/Linux) or Command Prompt (Windows).

```bash
npm install -g jsebot
```

**What does this do?**  
It downloads JSEBot (your AI assistant) to your computer.

**Expected output:**

```
✨ added 250 packages in 12s
```

---

## Step 2: Set It Up (Copy this exactly)

Now tell JSEBot where you want to use it.

```bash
jsebot onboard
```

**What happens next?**  
The wizard will ask you a few questions:

1. **"Where do you want to chat?"**
   - Pick from: WhatsApp, Telegram, Slack, Discord, etc.
   - (Just pick the app you use most)

2. **"What should I call you?"**
   - Type your name (e.g., `John`)

3. **"What's your preferred language?"**
   - Pick: English, Spanish, etc.

4. **"Install background service?"**
   - Type `y` for yes (this makes it always available)

**Expected output:**

```
✅ Setup Complete!
✅ Ready to chat on [Your App]
```

---

## Step 3: Start Using It (Copy this exactly)

Now you can chat with JSEBot!

```bash
jsebot
```

You'll see this prompt:

```
>
```

Just type a question and press Enter:

```
> What time is it?
```

JSEBot responds instantly:

```
It's currently 2:45 PM EST.
```

**That's it! You're chatting with your AI assistant.**

---

## What If Something Goes Wrong?

### Issue: "npm: command not found"

**Solution:** You need Node.js installed first.

- **Mac:** Download from [nodejs.org](https://nodejs.org) (pick "LTS")
- **Windows:** Download from [nodejs.org](https://nodejs.org) and run the installer
- **Linux:** Run `sudo apt install nodejs npm` (Ubuntu/Debian)

Then try Step 1 again.

---

### Issue: "jsebot: command not found"

**Solution:** Try this:

```bash
npm install -g jsebot
```

If that still doesn't work, restart your Terminal and try again.

---

### Issue: Setup wizard crashes

**Solution:** Make sure you're on Node.js 22 or newer:

```bash
node --version
```

Should show `v22.x.x` or higher.

---

## Next Steps

Once you're chatting, try these:

- **"What's the weather in [your city]?"**
- **"Set a reminder for tomorrow at 9am"**
- **"Tell me a joke"**
- **"What's 15% of $200?"**

JSEBot learns your style as you chat. The more you talk to it, the better it gets.

---

## Platform-Specific Help

- **[Windows User?](INSTALL-WINDOWS.md)** — Graphical step-by-step
- **[Mac User?](INSTALL-MAC.md)** — macOS-specific setup
- **[Linux User?](INSTALL-LINUX-SIMPLE.md)** — Linux setup (no jargon)
- **[Using Kali Linux?](INSTALL-KALI-SIMPLE.md)** — Kali-specific instructions

---

## Frequently Asked Questions (FAQ)

### "What's Node.js?"

Node.js is a program that JSEBot needs to run. Think of it like a "translator" that lets JSEBot talk to your computer.

You only install it once, then everything works.

---

### "Why do I need to copy those commands?"

Those commands tell your computer to:

1. Download JSEBot
2. Set it up for you
3. Start chatting

It's like installing an app on your phone — the commands automate the setup.

---

### "What does the Terminal/Command Prompt do?"

The Terminal (Mac/Linux) or Command Prompt (Windows) is a text-based way to control your computer. Instead of clicking buttons, you type commands.

**Don't worry:** This guide only has 3 commands. Copy and paste them — that's all you need.

---

### "Will this cost money?"

**Nope!** JSEBot itself is free.

However, if you connect it to OpenAI or Anthropic (for faster AI), those services may charge a small fee (usually 1-2 cents per conversation).

**Free options:**

- Use local AI models (no internet needed)
- Use the built-in free model (slower but works)

---

### "Is my chat private?"

**Yes.** Everything stays on your computer. Your conversations don't go to any server.

(When you use WhatsApp or Telegram, only those apps see your chat — same as always.)

---

### "Can I use this on my phone?"

Not directly on the phone's home screen, but:

- **If you have a computer at home:** JSEBot runs there, and you chat on WhatsApp/Telegram/Slack (like texting a friend)
- **Coming soon:** Dedicated mobile app for iPhone/Android

---

### "How do I turn it off?"

Just close the Terminal or Command Prompt window. JSEBot stops immediately.

(If you installed it as a background service, see [Advanced Users](#advanced-users) below.)

---

### "Can multiple people use it?"

Yes! But that's an advanced setup. See [Advanced Users](#advanced-users) below.

---

## Advanced Users

If you want to:

- 🤖 **Use a different AI brain** (OpenAI, local models, etc.)
- 👥 **Share with family/friends**
- 🔧 **Customize responses**
- 🚀 **Run as a background service**

See the [full documentation](README.md) or run:

```bash
jsebot --help
```

---

## Still Stuck?

1. **Check Node.js is installed:** `node --version` (should be v22+)
2. **Reinstall JSEBot:** `npm install -g jsebot`
3. **Run the setup again:** `jsebot onboard`

If you're still having trouble, come to our [Discord community](https://discord.gg/jsebot) and we'll help! 💙

---

## Ready to Go?

You now have a personal AI assistant! Start with simple questions and build from there.

Enjoy! 🚀
