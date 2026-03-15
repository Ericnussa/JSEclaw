# Phase 2: Quick Start Guide

**Status:** Ready to integrate  
**Version:** 1.0.0

---

## 🚀 30-Second Setup

### For Web/React

```jsx
import splash from "./assets/screens/dark/splash-dark.svg";

export function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return splashVisible ? <img src={splash} alt="JSEBot Splash" /> : <MainApp />;
}
```

### For CLI/Node.js

```javascript
const cli = require("./assets/components/cli-states");

cli.showWelcome({ version: "v0.1.1" });

const spinner = cli.createSpinner("Initializing...", "braille");
spinner.start();
await doWork();
spinner.succeed("Done!");
```

### For Mobile

```swift
// Show splash for 2 seconds
DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
  // Transition to main app
}
```

---

## 📁 Asset Locations

```
assets/screens/dark/          # Dark mode splashes
  splash-dark.svg             # 1920×1080 desktop
  splash-mobile-dark.svg      # 540×960 mobile

assets/screens/light/         # Light mode splashes
  splash-light.svg            # 1920×1080 desktop
  splash-mobile-light.svg     # 540×960 mobile

assets/components/
  onboarding.json             # 4-screen wizard definition
  cli-states.js               # Spinners & animations

assets/docs/
  PHASE-2-INTEGRATION.md      # Full integration guide
```

---

## 🎨 Choose Your Mode

### Dark Mode (Recommended)

- Better for terminal/CLI apps
- Neon cyan accents (#7dd3fc, #0ea5e9)
- High contrast, easy on eyes
- Shows Rubi robot with glowing effect

### Light Mode

- Better for web apps
- Darker blue text (#0284c7)
- Clean, professional look
- Maintains WCAG AA contrast

---

## 🧙 CLI States Quick Reference

### Spinners

```javascript
const cli = require("./assets/components/cli-states");

// Pick one:
cli.createSpinner("Loading...", "braille"); // ⠋⠙⠹⠸ (recommended)
cli.createSpinner("Loading...", "quarterCircle"); // ◐◓◑◒
cli.createSpinner("Loading...", "dots"); // ⠋⠙⠚⠞
cli.createSpinner("Loading...", "line"); // −\|/
cli.createSpinner("Loading...", "arrow"); // ←↖↑↗
cli.createSpinner("Loading...", "robot"); // 🤖
cli.createSpinner("Loading...", "hourglass"); // ⌛⏳
```

### Messages

```javascript
cli.showWelcome({ version: "v0.1.1" });
cli.showSuccess("Operation complete!");
cli.showError("Something went wrong");
cli.showInfo("Tip", "This is helpful information");
```

### Progress

```javascript
// Show percentage
console.log(cli.progressBar(45, 20)); // [████████░░░░░░░░░░░░]  45%

// Animate loading bar
for (let i = 0; i < 20; i++) {
  process.stdout.write("\r" + cli.loadingBar(i));
  await sleep(50);
}
```

---

## 🧅 Onboarding Flow Structure

```
onboarding.json
├── screens[]
│   ├── Welcome (hero + features)
│   ├── Setup (form: bot name, logging, updates)
│   ├── Config (multi-select: Discord, Slack, Telegram, custom)
│   └── Done (success + next steps)
├── theme
│   ├── dark { background, text, accent, ... }
│   └── light { ... }
└── robot { avatar, expressions, sprites }
```

**To render:** Parse JSON, create form inputs, save to `~/.jsebot/config.json`

---

## 🎯 Integration Checklist

### Minimal (works immediately)

- [x] Import splash screen SVG
- [x] Show for 1-2 seconds on startup
- [x] Auto-dismiss with fade-out

### Recommended

- [x] Import `cli-states.js` for spinners
- [x] Use `showWelcome()` banner on startup
- [x] Add spinners to async operations
- [x] Render onboarding flow on first run

### Full Featured

- [x] Dark/light mode detection
- [x] Responsive splash selection
- [x] Avatar animations (Phase 3)
- [x] Progress indicators
- [x] Multi-step workflows

---

## 🎨 Color Palette

| Element    | Dark    | Light   |
| ---------- | ------- | ------- |
| Primary    | #7dd3fc | #0284c7 |
| Accent     | #0ea5e9 | #0369a1 |
| Background | #0f172a | #f8fafc |
| Text       | #f1f5f9 | #0f172a |
| Success    | #10b981 | #059669 |
| Error      | #ef4444 | #dc2626 |

---

## 🚀 Example: Full Workflow

```javascript
const cli = require("./assets/components/cli-states");
const onboarding = require("./assets/components/onboarding.json");

async function initJSEBot() {
  // 1. Show welcome
  cli.showWelcome({ version: "v0.1.1" });

  // 2. Show multi-step progress
  const steps = [
    {
      name: "Checking dependencies",
      fn: async () => {
        await checkDeps();
      },
      successMsg: "Dependencies OK",
    },
    {
      name: "Loading channels",
      fn: async () => {
        await loadChannels();
      },
      successMsg: "Channels loaded",
    },
    {
      name: "Initializing AI",
      fn: async () => {
        await initAI();
      },
      successMsg: "AI ready",
    },
  ];

  await cli.runWorkflow(steps);

  // 3. Show success
  cli.showSuccess("JSEBot is ready!");
  console.log('Type "jsebot help" for commands\n');
}

initJSEBot().catch((err) => {
  cli.showError(err.message);
  process.exit(1);
});
```

---

## 📦 Dependencies

**Required:**

- Node.js 14+ (for cli-states.js)
- Modern browser (for SVG rendering)

**Optional:**

- `ora` npm package (enhanced spinners with colors)
  ```bash
  npm install ora
  ```

---

## 🧪 Testing Your Integration

### Visual Check

```bash
# Open splash screens in browser
open assets/screens/dark/splash-dark.svg

# Or view JSON schema
cat assets/components/onboarding.json | jq .
```

### CLI Test

```bash
node -e "
const cli = require('./assets/components/cli-states');
cli.showWelcome({ version: 'v0.1.1' });
const spinner = cli.createSpinner('Test...', 'braille');
spinner.start();
setTimeout(() => spinner.succeed('Works!'), 1500);
"
```

### Responsive Test

```bash
# Check if SVG scales properly
convert -resize 1280x720 assets/screens/dark/splash-dark.svg splash-1280.png
convert -resize 800x600 assets/screens/dark/splash-dark.svg splash-800.png
```

---

## 🐛 Troubleshooting

| Issue                 | Solution                                       |
| --------------------- | ---------------------------------------------- |
| SVG not showing       | Check MIME type: `Content-Type: image/svg+xml` |
| Spinner broken        | Install ora: `npm install ora`                 |
| Colors wrong          | Check terminal: `echo $TERM`                   |
| Onboarding not saving | Ensure `~/.jsebot/` exists with 755 perms      |
| Light mode too bright | Use CSS `prefers-color-scheme: light`          |

---

## 📚 Next Steps

1. **Review** splash screens & onboarding (PHASE-2.md)
2. **Integrate** into your app (see PHASE-2-INTEGRATION.md)
3. **Test** in your environment
4. **Deploy** Phase 2 to production
5. **Plan** Phase 3 (animations)

---

## 📖 Full Documentation

- **PHASE-2.md** — Overview & file structure
- **PHASE-2-SUMMARY.md** — Completion report & metrics
- **assets/docs/PHASE-2-INTEGRATION.md** — Full integration guide
- **assets/branding/BRANDING-PHASE-2.md** — Branding spec

---

## 💬 Questions?

All examples, code snippets, and API docs are in:

- `assets/docs/PHASE-2-INTEGRATION.md`
- `assets/branding/cli-states.md`
- `assets/components/onboarding.json` (schema)

---

_Ready to integrate Phase 2 into JSEBot? Start with PHASE-2-INTEGRATION.md_
