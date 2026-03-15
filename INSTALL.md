# 📥 How to Install JSEBot

**One command. That's it.**

---

## ⚡ Quick Install (All Platforms)

**Requires:** Node.js ≥22

```bash
npm install -g jsebot
```

**Verify it works:**

```bash
jsebot --version
```

Then run onboarding:

```bash
jsebot onboard --install-daemon
```

**Done!** 🎉

---

## Don't Have Node.js?

**Mac:**

```bash
brew install node
```

**Windows/Linux:** Download from [nodejs.org](https://nodejs.org) (click LTS)

Then run the `npm install -g jsebot` command above.

---

## Kali Linux Specific Issues?

If you're on Kali, see **[INSTALL-KALI.md](INSTALL-KALI.md)** for common permission fixes.

---

## Alternative Installation Methods

### Git Clone (Development)

```bash
git clone https://github.com/Ericnussa/JSEclaw.git
cd JSEclaw
pnpm install
pnpm build
node dist/cli.js onboard
```

### Docker

```bash
docker run -it --rm -v ~/.jsebot:/root/.jsebot \
  ericnussa/jsebot:latest \
  jsebot onboard
```

---

## Stuck?

- **Quick Start:** [QUICK-START.md](QUICK-START.md)
- **Troubleshooting:** [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- **Issues:** [GitHub](https://github.com/Ericnussa/JSEclaw/issues)

---

**Happy chatting!** 🤖
