## 🎉 JSEBot {{VERSION}} Released

**Release Date:** {{DATE}}  
**GitHub:** [{{VERSION}} on GitHub](https://github.com/Ericnussa/JSEclaw/releases/tag/{{VERSION}})  
**npm:** [@jsebot/{{VERSION}}](https://www.npmjs.com/package/jsebot/v/{{VERSION}})

---

## 📝 Summary

{{SUMMARY}}

Brief description of the major changes, features, and improvements in this release.

---

## ✨ What's New

### Features

- {{FEATURE_1}}
- {{FEATURE_2}}
- {{FEATURE_3}}

### Improvements

- {{IMPROVEMENT_1}}
- {{IMPROVEMENT_2}}

### Bug Fixes

- {{BUGFIX_1}} (#ISSUE_NUMBER)
- {{BUGFIX_2}} (#ISSUE_NUMBER)

---

## 🚨 Breaking Changes

{{#IF_BREAKING}}
This release contains **breaking changes**. Please review the list below before upgrading:

- **BREAKING:** {{BREAKING_CHANGE_1}} — [Migration guide](./docs/MIGRATION.md)
- **BREAKING:** {{BREAKING_CHANGE_2}} — See [CHANGELOG](./CHANGELOG.md#{{VERSION}})

{{/IF_BREAKING}}

{{#IF_NO_BREAKING}}
No breaking changes in this release. Safe to upgrade!
{{/IF_NO_BREAKING}}

---

## 📦 Installation

### Using npm

```bash
npm install -g jsebot@{{VERSION}}
```

### Using pnpm

```bash
pnpm add -g jsebot@{{VERSION}}
```

### Using yarn

```bash
yarn global add jsebot@{{VERSION}}
```

### From source

```bash
git clone https://github.com/Ericnussa/JSEclaw.git
cd JSEclaw
git checkout {{VERSION}}
pnpm install
pnpm build
npm install -g .
```

---

## 🐛 Known Issues

{{#IF_KNOWN_ISSUES}}

- {{KNOWN_ISSUE_1}} — Workaround: {{WORKAROUND_1}}
- {{KNOWN_ISSUE_2}} — Tracked in [#ISSUE_NUMBER](https://github.com/Ericnussa/JSEclaw/issues/ISSUE_NUMBER)

{{/IF_KNOWN_ISSUES}}

{{#IF_NO_KNOWN_ISSUES}}
No known critical issues reported. Please report any bugs via [GitHub Issues](https://github.com/Ericnussa/JSEclaw/issues).
{{/IF_NO_KNOWN_ISSUES}}

---

## 👥 Contributors

Thanks to everyone who contributed to this release:

{{CONTRIBUTORS_LIST}}

New to the project? Check out our [Contributing Guide](./CONTRIBUTING.md) — we'd love to have you! 💚

---

## 📚 Documentation

- **Full Changelog:** [{{VERSION}} in CHANGELOG.md](./CHANGELOG.md#{{VERSION}})
- **Getting Started:** [docs/GETTING-STARTED.md](./docs/GETTING-STARTED.md)
- **API Reference:** [docs/API.md](./docs/API.md)
- **Deployment Guide:** [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- **Architecture:** [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## 🔗 Quick Links

| Link            | URL                                              |
| --------------- | ------------------------------------------------ |
| **GitHub**      | https://github.com/Ericnussa/JSEclaw             |
| **npm**         | https://www.npmjs.com/package/jsebot             |
| **Docs**        | https://docs.openclaw.ai                         |
| **Discord**     | https://discord.gg/jsebot                        |
| **Issues**      | https://github.com/Ericnussa/JSEclaw/issues      |
| **Discussions** | https://github.com/Ericnussa/JSEclaw/discussions |

---

## 💬 Feedback

Have feedback or found an issue? Let us know:

- 🐛 **Bug Report:** [GitHub Issues](https://github.com/Ericnussa/JSEclaw/issues/new/choose)
- 💬 **Discussion:** [GitHub Discussions](https://github.com/Ericnussa/JSEclaw/discussions)
- 💬 **Discord:** [JSEBot Discord Server](https://discord.gg/jsebot)

---

**Made with ❤️ by Eric (@Ericnussa) and the JSEBot community**
