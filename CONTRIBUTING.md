# Contributing to JSEBot

Thanks for your interest in contributing! JSEBot is a community project, and we welcome all kinds of help.

## 🤝 Ways to Contribute

- **Bug reports** — Found an issue? [Open an issue](https://github.com/Ericnussa/JSEclaw/issues/new)
- **Feature ideas** — Have an idea? [Start a discussion](https://github.com/Ericnussa/JSEclaw/discussions)
- **Code** — Fix a bug or build a feature (see below)
- **Documentation** — Improve guides, add examples, fix typos
- **Skills** — Publish reusable tools to the [Skills Marketplace](docs/SKILLS.md)
- **Design** — Help with UI/UX, branding, or graphics

## 🚀 Development Setup

### Prerequisites

- **Node ≥22** — Check with `node --version`
- **pnpm** — `npm install -g pnpm` (faster than npm)
- **Git** — For cloning and submitting PRs

### Quick Start

```bash
# Clone the repo
git clone https://github.com/Ericnussa/JSEclaw.git
cd JSEclaw

# Install dependencies
pnpm install

# Build from source
pnpm build

# Run tests
pnpm test

# Start dev mode (auto-reload on changes)
pnpm gateway:watch
```

### Directory Structure

```
JSEclaw/
├── src/                   # TypeScript source
│   ├── cli/               # Command-line interface
│   ├── gateway/           # Control plane daemon
│   ├── channels/          # Chat platform integrations
│   ├── plugins/           # Plugin system
│   └── tools/             # First-class tools
├── assets/                # Branding, icons, sprites
│   ├── branding/          # Logo, icons (Phase 1)
│   ├── screens/           # Splash screens (Phase 2)
│   └── components/        # Sprite engine (Phase 3)
├── docs/                  # Documentation
├── test/                  # Test files
├── dist/                  # Compiled output (generated)
└── package.json           # Dependencies
```

## 🐛 Bug Reports

### Before Submitting

1. **Search existing issues** — Your bug might already be reported
2. **Check the FAQ** — Common issues documented there
3. **Gather info:**
   - JSEBot version: `jsebot --version`
   - Node version: `node --version`
   - OS: macOS, Linux, Windows (WSL), etc.
   - Channels affected: Discord, WhatsApp, etc.
   - Error message or unexpected behavior

### Issue Template

```markdown
## Description

Brief description of the bug.

## Steps to Reproduce

1. Install JSEBot
2. Run `jsebot agent --message "..."`
3. Observe unexpected behavior

## Expected Behavior

What should happen

## Actual Behavior

What actually happened

## Environment

- JSEBot: 2026.3.2
- Node: 22.0.0
- OS: macOS 14.3
- Channel: Discord

## Error Message
```

Copy-paste any error output here

```

```

## ✨ Feature Requests

### Before Proposing

1. **Check the roadmap** — Feature might be planned ([ROADMAP.md](ROADMAP.md))
2. **Read the vision** — Understand the project direction ([VISION.md](VISION.md))
3. **Start a discussion** — Get feedback before writing code

### Discussion Template

```markdown
## Feature: [Brief Title]

### Problem

What problem does this solve? Is it a limitation of JSEBot?

### Proposed Solution

How would you implement this?

### Examples

Real-world use cases or user stories.

### Alternatives

Other approaches you considered.
```

## 💻 Code Contributions

### Workflow

1. **Fork the repo** — Click "Fork" on GitHub
2. **Create a branch** — `git checkout -b fix/your-fix` or `feat/your-feature`
3. **Make changes** — Keep commits atomic and descriptive
4. **Write tests** — Maintain or improve code coverage
5. **Test locally** — `pnpm test` and `pnpm build`
6. **Push and create PR** — GitHub will prompt you
7. **Respond to feedback** — We'll review and iterate

### Branch Naming

- `fix/short-description` — Bug fixes
- `feat/short-description` — New features
- `docs/short-description` — Documentation updates
- `refactor/short-description` — Code cleanup
- `test/short-description` — Tests

### Commit Messages

Keep them clear and concise:

```
fix: handle DM pairing edge case in Discord channel

Fixes #123. When a user sends a DM before approving the pairing code,
the bot now returns a helpful error message instead of crashing.
```

Format: `<type>: <description>` where type is one of:

- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation
- `test` — Tests
- `refactor` — Code cleanup
- `perf` — Performance improvement

### Code Style

We use **Prettier** for formatting and **ESLint** for linting:

```bash
# Check formatting
pnpm lint

# Auto-fix
pnpm lint --fix

# Format code
pnpm format
```

**Style guidelines:**

- **TypeScript** — Strongly typed, no `any` without a comment
- **Async/await** — Preferred over callbacks and promise chains
- **Error handling** — Always handle rejections; use try/catch
- **Comments** — Explain _why_, not _what_
- **Tests** — Unit tests for new functionality

### Testing

All changes should include tests:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test
pnpm test channels/discord
```

We use **Vitest** for unit tests and **E2E tests** for integration flows.

**Test template:**

```typescript
import { describe, it, expect } from "vitest";
import { myFunction } from "./my-function";

describe("myFunction", () => {
  it("should handle basic input", () => {
    expect(myFunction("hello")).toBe("HELLO");
  });

  it("should throw on invalid input", () => {
    expect(() => myFunction(null)).toThrow();
  });
});
```

## 📚 Documentation Contributions

Documentation lives in:

- **[README.md](README.md)** — Project overview and quick start
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — This file
- **[docs/](docs/)** — In-depth guides and API reference
- **[SECURITY.md](SECURITY.md)** — Security policy and best practices

### Adding Documentation

1. **For new features:** Add a section to the relevant guide
2. **For guides:** Create a new `.md` file in `docs/`
3. **For API docs:** Use JSDoc comments in source code
4. **For examples:** Add a working code sample

**Format:**

- **Headings:** Use `#`, `##`, `###` (not underlines)
- **Code blocks:** Use triple backticks with language tag
- **Links:** Use relative paths (`docs/API.md`) for internal
- **Lists:** Use `-` for bullets, `1.` for numbered
- **Tables:** Use GFM table syntax

## 🛠️ Skills & Plugins

**Skills** are reusable tools shared via the [Marketplace](docs/SKILLS.md):

```bash
# Install a skill
jsebot skill install slack

# Create your own
jsebot skill create my-skill

# Publish (requires authentication)
jsebot skill publish ./my-skill
```

See [Skills Guide](docs/SKILLS.md) for creating and publishing.

## 🔒 Security

Found a security vulnerability? **Please don't open a public issue.**

Email [security@jsebot.dev](mailto:security@jsebot.dev) with:

1. **Vulnerability description** — What is the issue?
2. **Affected versions** — Which versions are impacted?
3. **Proof of concept** — How to reproduce it
4. **Suggested fix** — Proposed solution (if you have one)

We'll acknowledge within 48 hours and work on a fix.

## 📋 PR Checklist

Before submitting a pull request:

- [ ] I've read [CONTRIBUTING.md](CONTRIBUTING.md)
- [ ] My branch is up to date with `main`
- [ ] I've added tests for my changes
- [ ] All tests pass: `pnpm test`
- [ ] Code is formatted: `pnpm lint --fix`
- [ ] Commit messages are clear and descriptive
- [ ] Documentation is updated (if applicable)
- [ ] No new warnings or errors in the build

## 🎯 What Happens Next?

1. **Automated checks** — CI runs tests and linting
2. **Review** — Maintainers review your code
3. **Feedback** — We might ask for changes
4. **Merge** — Once approved, your code goes to `main`!

We aim to respond to PRs within 48 hours.

## 🙋 Questions?

- **Issues & bugs:** [GitHub Issues](https://github.com/Ericnussa/JSEclaw/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Ericnussa/JSEclaw/discussions)
- **Discord:** [Join our server](https://discord.gg/jsebot)
- **Email:** [hello@jsebot.dev](mailto:hello@jsebot.dev)

---

## 💡 Good First Issues

Looking to get started? Check out issues labeled:

- [`good first issue`](https://github.com/Ericnussa/JSEclaw/labels/good%20first%20issue) — Great for new contributors
- [`help wanted`](https://github.com/Ericnussa/JSEclaw/labels/help%20wanted) — We need your expertise
- [`documentation`](https://github.com/Ericnussa/JSEclaw/labels/documentation) — Help improve docs

---

**Thanks for contributing! Your help makes JSEBot better for everyone.** ❤️
