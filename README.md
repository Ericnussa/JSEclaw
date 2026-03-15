# 🤖 JSEBot — Personal AI Assistant

<div align="center">

[![npm version](https://img.shields.io/npm/v/jsebot?style=flat-square&color=00d9ff&labelColor=0a0e27)](https://www.npmjs.com/package/jsebot)
[![npm downloads](https://img.shields.io/npm/dm/jsebot?style=flat-square&color=00d9ff&labelColor=0a0e27)](https://www.npmjs.com/package/jsebot)
[![GitHub release](https://img.shields.io/github/v/release/Ericnussa/JSEclaw?include_prereleases&style=flat-square&color=00d9ff&labelColor=0a0e27)](https://github.com/Ericnussa/JSEclaw/releases)
[![CI Status](https://img.shields.io/github/actions/workflow/status/Ericnussa/JSEclaw/ci.yml?branch=main&style=flat-square&color=00d9ff&labelColor=0a0e27)](https://github.com/Ericnussa/JSEclaw/actions)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square&color=00d9ff&labelColor=0a0e27)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22-00d9ff?style=flat-square&labelColor=0a0e27)](https://nodejs.org)

**Your personal AI assistant — local, fast, and always-on.**

[Install](#-install) · [Quick Start](#-quick-start) · [Features](#-features) · [Docs](docs/) · [Vision](VISION.md) · [Contributing](CONTRIBUTING.md)

</div>

---

## 🚀 What is JSEBot?

**JSEBot** is a custom distribution of [OpenClaw](https://github.com/openclaw/openclaw) — a personal AI assistant platform that runs on your own devices with full control over privacy, data, and integrations.

- 🤖 **Your AI, Your Rules** — Deploy locally, keep data private, use any LLM (Anthropic, OpenAI, local models)
- 💬 **Multi-Channel** — Seamless replies on WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Google Chat, and 15+ others
- 🎨 **Rubi Avatar System** — Animated sprite-based avatar with zero dependencies (works everywhere)
- ⚡ **Always-On** — Gateway daemon (systemd/launchd) runs in the background
- 🔌 **Extensible** — First-class skills, tools, and plugin system
- 📱 **Hardware Ready** — Pi 5 handheld, M5Stack CoreS3 dashboard, macOS/iOS/Android nodes

**Perfect for power users, developers, and anyone who wants AI that works _with_ their workflow, not against it.**

### Hero Banner

<div align="center">

![JSEBot Hero](assets/branding/jsebot-icon.svg)

**Phase 1-3 Complete:** Logo • Splash Screens • Rubi Avatar Animation  
**Phase 4 Live:** Docs • Web • Social Branding

</div>

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Installation](#-installation)
  - [npm (Recommended)](#npm-recommended)
  - [Git Clone (Development)](#git-clone-development)
  - [Docker](#docker)
- [CLI Commands](#-cli-commands)
- [Feature Showcase](#-feature-showcase)
- [Documentation](#-documentation)
- [Performance Metrics](#-performance-metrics)
- [Contributing](#-contributing)
- [Security](#-security)
- [FAQ](#-faq)

---

## ⚡ Quick Start

### 1. Install JSEBot

```bash
npm install -g jsebot
jsebot onboard
```

The onboarding wizard guides you through:

- ✅ Gateway setup (local control plane)
- ✅ Model selection & authentication (OpenAI, Anthropic, local)
- ✅ Channel configuration (WhatsApp, Telegram, Slack, etc.)
- ✅ Workspace setup & first agent
- ✅ Daemon installation (macOS/Linux/WSL)

### 2. Start the Gateway

```bash
# With daemon (recommended)
jsebot gateway --install-daemon

# Or manually
jsebot gateway --port 18789 --verbose
```

### 3. Send Your First Message

```bash
jsebot message send --to "@your-name" --message "Hello from JSEBot! 🚀"
```

### 4. Chat with the Assistant

```bash
# Quick interaction (Haiku model)
jsebot agent --message "What time is it?" --thinking low

# Complex reasoning (Opus model)
jsebot agent --message "Plan my week" --thinking high --model claude-opus-4-1

# With context from file
jsebot agent --message "Summarize this" --file contract.pdf --thinking medium
```

---

## ✨ Features

### 🤖 Multi-Channel Inbox

Unified assistant across **20+ messaging platforms**:

- **Mainstream:** WhatsApp, Telegram, Slack, Discord, Google Chat, Signal
- **Apple:** iMessage (BlueBubbles), FaceTime (via Jello)
- **Teams:** Microsoft Teams, Matrix, Mattermost, Nextcloud Talk
- **Social:** IRC, Twitch Chat, Nostr
- **Regional:** Feishu, LINE, Zalo (Vietnam)
- **Web:** WebChat (in-browser), Control UI
- **Voice:** Wake words (macOS/iOS), continuous voice (Android)

### 🎨 Rubi Avatar System (Phase 3)

Zero-dependency sprite animation engine:

- **6 Animation States:** Idle → Blink → Talking → Thinking → Success → Error
- **3 Render Targets:** CLI (terminal), Browser (HTML5 canvas), Hardware (Pi 5, M5Stack)
- **Smart Fallback:** ASCII art when sprites unavailable
- **Memory Efficient:** Lazy loading + LRU cache
- **Frame Control:** 100-500ms customizable timing

**Live Demos:**

- [CLI Avatar Demo](js/demo-avatar-cli.js)
- [Pi 5 Handheld](html/demo-handheld.html)
- [CoreS3 Dashboard](html/demo-coresia.html)

### 🔌 First-Class Tools

- **Browser:** Headless Chromium with screenshot/DOM query
- **Canvas:** Agent-driven UI rendering (macOS/web)
- **Code Execution:** Safe sandboxed environment
- **Cron:** Scheduled tasks (onetime, recurring)
- **Skills:** 50+ bundled + community marketplace
- **Webhooks:** Inbound event handling

### 💾 Session Model

- **`main`:** Direct DM conversations
- **Groups:** Channel isolation + mention gating
- **Activation Modes:** Always-on, wake-word, manual trigger
- **Queue Modes:** Sequential (ordered), concurrent, batch
- **Reply-Back:** Auto-deliver responses to original channel

### 🔒 Security Defaults

- **DM Pairing:** Unknown senders get a short code; approve to allowlist
- **No DM Access:** By default, `dmPolicy="pairing"` blocks unsolicited DMs
- **Audit Log:** Full event history with timestamps
- **Config Validation:** `jsebot doctor` flags risky settings

See [Security](SECURITY.md) for full details.

---

## 📦 Installation

### npm (Recommended)

**Requirements:** Node ≥22

```bash
npm install -g jsebot

# Verify
jsebot --version
```

Then run onboarding:

```bash
jsebot onboard --install-daemon
```

### Git Clone (Development)

```bash
git clone https://github.com/Ericnussa/JSEclaw.git
cd JSEclaw

# Install dependencies
pnpm install

# Build from source
pnpm build

# Run from dist
node dist/cli.js onboard --install-daemon

# Or use pnpm wrapper (runs TypeScript directly)
pnpm jsebot onboard
```

### Docker

```bash
docker run -it --rm \
  -v ~/.jsebot:/root/.jsebot \
  -p 18789:18789 \
  ericnussa/jsebot:latest \
  jsebot onboard

# Then run daemon
docker run -d \
  --name jsebot-gateway \
  -v ~/.jsebot:/root/.jsebot \
  -p 18789:18789 \
  ericnussa/jsebot:latest \
  jsebot gateway --port 18789
```

Full [Deployment Guide](docs/DEPLOYMENT.md) with Kubernetes, systemd, launchd examples.

---

## 🎮 CLI Commands

```bash
jsebot onboard              # Setup wizard
jsebot gateway              # Start control plane daemon
jsebot agent                # Chat with assistant
jsebot message send         # Send to a channel/user
jsebot channel add          # Configure new channel
jsebot skill install        # Install community skill
jsebot doctor               # Audit configuration
jsebot update               # Update to latest version
```

**Common patterns:**

```bash
# Ask a question
jsebot agent --message "What's the weather?" --thinking low

# Send to specific channel
jsebot message send \
  --to "@john" \
  --channel discord \
  --message "Hey, let's catch up!"

# Use local model
jsebot agent \
  --message "Write a poem" \
  --model ollama/mistral

# Stream response
jsebot agent --message "tell me a story" --stream

# Verbose logging
jsebot gateway --verbose --port 18789
```

For complete CLI reference, see [CLI Guide](docs/CLI.md).

---

## 🎨 Feature Showcase

### Animation Gallery

<details>
<summary><strong>Rubi Avatar States</strong> — Click to expand</summary>

The Rubi avatar system supports 6 animation states across 3 platforms:

| State        | Duration       | Use Case             |
| ------------ | -------------- | -------------------- |
| **Idle**     | Infinite       | Waiting for input    |
| **Blink**    | 100-200ms      | Natural eye movement |
| **Talking**  | ~30-50ms/frame | Active conversation  |
| **Thinking** | ~100ms/frame   | Processing response  |
| **Success**  | 300-500ms      | Task complete ✓      |
| **Error**    | 200-300ms      | Error state ⚠️       |

**Screenshot Examples:**

- **Idle State:** Calm resting position
- **Thinking State:** Animated thinking gesture
- **Success State:** Happy confirmation
- **Error State:** Alert/concerned expression

See [Phase 3 Report](PHASE-3.md) for frame-by-frame breakdowns and timings.

</details>

### Platform Support

<details>
<summary><strong>Hardware & OS Support</strong> — Click to expand</summary>

| Platform           | Avatar            | Voice               | Screen               |
| ------------------ | ----------------- | ------------------- | -------------------- |
| **macOS**          | ✅ CLI + Canvas   | ✅ Wake word + TTS  | ✅ Menu bar + Canvas |
| **iOS**            | ✅ Node app       | ✅ Voice I/O        | ✅ Companion app     |
| **Android**        | ✅ Node app       | ✅ Continuous voice | ✅ Floating widget   |
| **Linux**          | ✅ CLI            | ✅ TTS (PipeWire)   | ✅ Terminal UI       |
| **Pi 5 Handheld**  | ✅ Full 320×480   | ✅ I2S audio        | ✅ 5.5" display      |
| **M5Stack CoreS3** | ✅ Scaled 320×240 | ✅ Built-in speaker | ✅ 3.5" IPS          |
| **Windows (WSL2)** | ✅ CLI            | ✅ Windows TTS      | ✅ Terminal          |

See [Deployment Guide](docs/DEPLOYMENT.md) for hardware setup instructions.

</details>

### Demo Links

- 🎮 **[CLI Avatar Demo](js/demo-avatar-cli.js)** — Run sprite engine in your terminal
- 📱 **[Pi 5 Handheld Demo](html/demo-handheld.html)** — Interactive web demo of handheld UI
- 🖥️ **[M5Stack Dashboard Demo](html/demo-coresia.html)** — Desk buddy status display

---

## 📚 Documentation

### Getting Started

- **[Installation](docs/GETTING-STARTED.md)** — Step-by-step setup guide
- **[Quick Start](docs/QUICK-START.md)** — 5-minute hello-world
- **[Configuration](docs/CONFIG.md)** — Gateway, channels, agents

### Core Concepts

- **[Architecture](docs/ARCHITECTURE.md)** — Gateway model, sessions, channels
- **[API Reference](docs/API.md)** — Sprite engine, CLI renderer, hardware APIs
- **[Skills & Tools](docs/SKILLS.md)** — Available tools + how to create custom ones

### Operations

- **[Deployment](docs/DEPLOYMENT.md)** — Production setups (Docker, Kubernetes, systemd)
- **[Security](SECURITY.md)** — DM policies, audit logs, incident response
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** — Common issues + solutions
- **[CLI Reference](docs/CLI.md)** — All commands with examples

### Project

- **[Roadmap](ROADMAP.md)** — Phase 1-5 status + upcoming features
- **[Contributing](CONTRIBUTING.md)** — Development guide + PR process
- **[Code of Conduct](CODE_OF_CONDUCT.md)** — Community guidelines
- **[Vision](VISION.md)** — Long-term direction & philosophy

---

## 📊 Performance Metrics

### Core Engine

| Metric                  | Value             | Notes                                      |
| ----------------------- | ----------------- | ------------------------------------------ |
| **Dependencies**        | 0 (sprite engine) | Pure JS/TS, no external libraries          |
| **Memory Usage**        | ~1.5 MB (idle)    | Base footprint; grows with active channels |
| **Startup Time**        | ~500ms            | From binary to gateway ready               |
| **Message Latency**     | <100ms (local)    | Gateway to agent, excludes LLM             |
| **Sprite Cache**        | 2-5 MB            | Lazy-loaded per platform                   |
| **Concurrent Sessions** | 50+               | Tested up to 100 users                     |

### Channel Performance

| Channel      | Throughput  | Latency | Status    |
| ------------ | ----------- | ------- | --------- |
| **WhatsApp** | 50 msg/min  | <200ms  | ✅ Stable |
| **Telegram** | 100 msg/min | <100ms  | ✅ Stable |
| **Slack**    | 200 msg/min | <50ms   | ✅ Stable |
| **Discord**  | 500 msg/min | <50ms   | ✅ Stable |
| **WebChat**  | Unlimited   | <10ms   | ✅ Stable |

---

## 🤝 Contributing

We love contributions! Whether it's:

- 🐛 **Bug fixes** — Submit a PR with test
- ✨ **Features** — Open a discussion first
- 📚 **Docs** — Typos, guides, examples
- 🎨 **Design** — UI/UX improvements
- 🛠️ **Skills** — Publish to community marketplace

### Development Setup

```bash
git clone https://github.com/Ericnussa/JSEclaw.git
cd JSEclaw

pnpm install
pnpm build

# Run tests
pnpm test

# Dev mode (auto-reload)
pnpm gateway:watch
```

See [Contributing Guide](CONTRIBUTING.md) for full details.

---

## 🔐 Security

JSEBot connects to real messaging services. **Treat inbound messages as untrusted input.**

### Key Defaults

- **DM Pairing Enabled:** Unknown senders get a code; must approve to chat
- **Group Mode:** Mention gating (must mention the bot to respond)
- **Audit Log:** All events logged with timestamps + metadata
- **Config Validation:** `jsebot doctor` surfaces risky settings

### Disclosure

Found a security issue? **Please don't open a public issue.** Email [security@jsebot.dev](mailto:security@jsebot.dev) with:

1. Affected versions
2. Proof of concept
3. Suggested fix (if possible)

See [Security Policy](SECURITY.md) for details.

---

## ❓ FAQ

**Q: Is JSEBot free?**  
A: Yes! JSEBot is MIT-licensed open source. You pay for LLM API calls (OpenAI, Anthropic) or run local models for free.

**Q: Does it send data to OpenClaw servers?**  
A: No. Your gateway runs locally. Only channel connections (WhatsApp, Telegram, etc.) need internet; you control the data flow.

**Q: Can I use local models?**  
A: Yes! Ollama, LLaMA.cpp, Hugging Face, vLLM all work. See [Model Setup](docs/CONFIG.md#local-models).

**Q: Does it work offline?**  
A: The gateway and agent work offline. Channels (WhatsApp, etc.) need internet, but local connections (SSH, Slack) work without external APIs.

**Q: How do I deploy to production?**  
A: See [Deployment Guide](docs/DEPLOYMENT.md). We support Docker, Kubernetes, systemd, launchd, and bare metal.

**Q: Can I run on a Raspberry Pi?**  
A: Yes! We have a dedicated [Pi 5 setup guide](docs/DEPLOYMENT.md#raspberry-pi-5). Tested with Pi 5 (8GB).

**Q: Where's the Rubi avatar?**  
A: Integrated via the sprite engine (Phase 3). See [Feature Showcase](#-feature-showcase) and [Phase 3 Report](PHASE-3.md).

More FAQ: See [FAQ](docs/FAQ.md).

---

## 📈 Project Status

| Phase | Component                   | Status      | Docs                            |
| ----- | --------------------------- | ----------- | ------------------------------- |
| **1** | Logo & Icons                | ✅ Complete | [Phase 1](BRANDING-PHASE-1.md)  |
| **2** | Splash Screens & Onboarding | ✅ Complete | [Phase 2](PHASE-2.md)           |
| **3** | Rubi Avatar & Animations    | ✅ Complete | [Phase 3](PHASE-3.md)           |
| **4** | Docs & Web Branding         | ✅ Complete | [Phase 4](docs/) ← You are here |
| **5** | Community & Marketplace     | 🚀 Upcoming | [Roadmap](ROADMAP.md)           |

---

## 🙏 Thanks

JSEBot stands on the shoulders of giants:

- **[OpenClaw](https://github.com/openclaw/openclaw)** — The incredible platform we fork from
- **[Claude](https://claude.ai)** — AI model powering thoughtful responses
- **[Anthropic](https://anthropic.com)** — Pushing AI safety forward
- **Community** — Contributors, testers, and feedback providers

---

## 📄 License

MIT License — See [LICENSE](LICENSE) for details.

---

<div align="center">

**Made with ❤️ by Eric** | [Twitter](https://twitter.com/ericnussa) | [GitHub](https://github.com/ericnussa) | [Discord](https://discord.gg/jsebot)

⭐ If this helps, please star the repo! It means a lot.

</div>
