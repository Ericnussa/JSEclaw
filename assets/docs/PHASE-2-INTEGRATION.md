# JSEBot Phase 2: Integration Guide

**Version:** 1.0.0  
**Status:** Complete  
**Last Updated:** March 2026

---

## Overview

This guide explains how to integrate Phase 2 splash screens, onboarding flows, and CLI states into JSEBot. All assets are ready to use and organized in the project structure.

---

## Asset Location & Structure

```
JSEclaw/assets/
├── screens/                           # Splash screen SVGs
│   ├── dark/
│   │   ├── splash-dark.svg            # 1920x1080 dark startup splash
│   │   └── splash-mobile-dark.svg     # 540x960 mobile dark splash
│   ├── light/
│   │   ├── splash-light.svg           # 1920x1080 light startup splash
│   │   └── splash-mobile-light.svg    # 540x960 mobile light splash
│   └── [existing branding assets]
│
├── components/
│   ├── onboarding.json                # Interactive onboarding flow definition
│   ├── cli-states.js                  # CLI spinners, animations, helpers
│   └── [other components]
│
└── docs/
    └── PHASE-2-INTEGRATION.md         # This file
```

---

## 1. Splash Screens

### 1.1 Desktop Splash Screens

**Files:**
- `assets/screens/dark/splash-dark.svg` (1920×1080)
- `assets/screens/light/splash-light.svg` (1920×1080)

**Usage in Web/Desktop Apps:**

```html
<!-- Import splash screen SVG -->
<div id="splash-screen" style="
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  background: #0f172a;
">
  <img 
    src="/assets/screens/dark/splash-dark.svg" 
    alt="JSEBot Splash"
    style="max-width: 100%; max-height: 100%;"
  />
</div>
```

**Timing:**
- Show for 1-2 seconds during startup
- Auto-dismiss when app is ready
- Fade out transition (200-300ms)

**CSS Fade-Out Example:**

```css
#splash-screen {
  transition: opacity 0.3s ease-out;
}

#splash-screen.fade-out {
  opacity: 0;
  pointer-events: none;
}
```

**JavaScript Dismiss:**

```javascript
function dismissSplash() {
  const splash = document.getElementById('splash-screen');
  splash.classList.add('fade-out');
  
  setTimeout(() => {
    splash.remove();
  }, 300);
}

// Dismiss after 2 seconds or when ready (whichever is later)
setTimeout(dismissSplash, 2000);
```

### 1.2 Mobile Splash Screens

**Files:**
- `assets/screens/dark/splash-mobile-dark.svg` (540×960)
- `assets/screens/light/splash-mobile-light.svg` (540×960)

**Usage in Mobile Apps:**

```swift
// SwiftUI Example
import SwiftUI

struct SplashScreen: View {
    @State var isVisible = true
    
    var body: some View {
        ZStack {
            if isVisible {
                Image("splash-mobile-dark")
                    .resizable()
                    .scaledToFit()
                    .ignoresSafeArea()
                    .transition(.opacity)
                    .onAppear {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                            withAnimation {
                                isVisible = false
                            }
                        }
                    }
            }
        }
    }
}
```

**Android Example:**

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Show splash screen
        Thread {
            Thread.sleep(2000) // 2 second display
            startActivity(Intent(this, HomeActivity::class.java))
            finish()
        }.start()
    }
}
```

### 1.3 Responsive Selection

**Detect Display Type & Show Appropriate Screen:**

```javascript
function getSplashScreen() {
  const isMobile = window.innerWidth < 768;
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (isMobile) {
    return isDark 
      ? '/assets/screens/dark/splash-mobile-dark.svg'
      : '/assets/screens/light/splash-mobile-light.svg';
  } else {
    return isDark
      ? '/assets/screens/dark/splash-dark.svg'
      : '/assets/screens/light/splash-light.svg';
  }
}

const splashImg = document.querySelector('#splash-screen img');
splashImg.src = getSplashScreen();
```

---

## 2. Interactive Onboarding Flow

### 2.1 Onboarding Definition

**File:** `assets/components/onboarding.json`

The JSON defines:
- **4 screens:** Welcome → Setup → Config → Done
- **Rubi avatar expressions:** Wave, thinking, smile, nod, thumbs up, celebrate
- **Form fields & validation:** Bot name, logging, updates, channel selection
- **Theme colors:** Dark and light mode palettes
- **Storage:** Persistence to `~/.jsebot/config.json`

### 2.2 Onboarding Renderer (React Example)

```typescript
// src/components/OnboardingFlow.tsx
import React, { useState } from 'react';
import onboardingData from '../assets/components/onboarding.json';

export const OnboardingFlow: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [config, setConfig] = useState({});
  
  const screens = onboardingData.screens;
  const screen = screens[currentScreen];
  
  const handleNext = () => {
    // Navigate to next screen based on action
    const action = screen.actions[0]; // "Next" button
    const nextIdx = screens.findIndex(s => s.id === action.navigation);
    setCurrentScreen(nextIdx);
  };
  
  const handleSave = async () => {
    // Save config to ~/.jsebot/config.json
    await fetch('/api/config/save', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  };
  
  return (
    <div style={getThemeStyles()}>
      <div className="onboarding-container">
        {/* Render current screen */}
        <h1>{screen.title}</h1>
        {/* Render content based on screen.content.type */}
        {/* Render Rubi avatar with animation */}
        {/* Render actions */}
      </div>
    </div>
  );
};
```

### 2.3 Onboarding Renderer (Vue Example)

```vue
<template>
  <div class="onboarding" :style="themeStyles">
    <!-- Screen content -->
    <div v-if="currentScreen.content.type === 'welcome'" class="welcome-screen">
      <img :src="`/assets/screens/${currentScreen.content.avatarAsset}`" />
      <h1>{{ currentScreen.title }}</h1>
      <p>{{ currentScreen.content.message }}</p>
      
      <div class="features">
        <div v-for="feature in currentScreen.content.features" :key="feature.icon" class="feature">
          <span class="icon">{{ feature.icon }}</span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- Navigation -->
    <div class="actions">
      <button 
        v-for="action in currentScreen.actions" 
        :key="action.id"
        @click="handleAction(action)"
        :class="action.style"
      >
        {{ action.label }}
      </button>
    </div>
  </div>
</template>

<script>
import onboarding from '@/assets/components/onboarding.json';

export default {
  data() {
    return {
      screens: onboarding.screens,
      currentScreenIdx: 0,
      config: {}
    };
  },
  computed: {
    currentScreen() {
      return this.screens[this.currentScreenIdx];
    },
    themeStyles() {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = isDark ? onboarding.theme.dark : onboarding.theme.light;
      return {
        backgroundColor: theme.background,
        color: theme.text
      };
    }
  },
  methods: {
    handleAction(action) {
      if (action.action === 'close') {
        this.$emit('complete', this.config);
      } else if (action.navigation) {
        this.currentScreenIdx = this.screens.findIndex(
          s => s.id === action.navigation
        );
      }
    }
  }
};
</script>
```

### 2.4 Onboarding in CLI

```javascript
// CLI/Node.js implementation
const onboarding = require('./assets/components/onboarding.json');
const fs = require('fs');
const path = require('path');
const ora = require('ora');

async function runOnboarding() {
  const configDir = path.expandUser('~/.jsebot');
  const configFile = path.join(configDir, 'config.json');
  
  // Check if already completed
  if (fs.existsSync(configFile)) {
    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
    if (config.onboarding_completed_v1) {
      console.log('Already onboarded!');
      return;
    }
  }
  
  // Show welcome banner
  const { showWelcome } = require('./assets/components/cli-states');
  showWelcome({ version: 'v0.1.1', minimal: false });
  
  // Render form for setup screen
  const botName = await prompt('Bot Name:', 'JSEBot');
  const enableLogging = await confirm('Enable Debug Logging?');
  const checkUpdates = await confirm('Check for Updates?');
  
  // Render checklist for config screen
  const channels = await select('Select Channels:', [
    'Discord',
    'Slack',
    'Telegram',
    'Custom'
  ], { multiple: true });
  
  // Save config
  const config = {
    bot_name: botName,
    enable_logging: enableLogging,
    check_updates: checkUpdates,
    discord: channels.includes('Discord'),
    slack: channels.includes('Slack'),
    telegram: channels.includes('Telegram'),
    custom: channels.includes('Custom'),
    onboarding_completed_v1: true
  };
  
  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  
  // Show completion
  const { showSuccess } = require('./assets/components/cli-states');
  showSuccess('Setup complete! Type "jsebot help" for commands.');
}
```

---

## 3. CLI States & Animations

### 3.1 CLI States Module

**File:** `assets/components/cli-states.js`

**Features:**
- 7 spinner types (quarterCircle, braille, dots, line, arrow, robot, hourglass)
- ASCII art messages (success, error, welcome, info)
- Color helpers (colorize, stripColor)
- Integration with `ora` library
- Progress bars and loading indicators
- Advanced patterns for multi-step workflows

### 3.2 Basic Usage

```javascript
const cli = require('./assets/components/cli-states');

// Show welcome banner
cli.showWelcome({ version: 'v0.1.1', minimal: false });

// Create a spinner
const spinner = cli.createSpinner('Loading...', 'braille');
spinner.start();

// Simulate work
setTimeout(() => {
  spinner.succeed('Complete!');
  cli.showSuccess('Operation successful');
}, 2000);
```

### 3.3 Spinner Types

```javascript
const cli = require('./assets/components/cli-states');

// 4-frame quarter circle (minimal)
cli.spinners.quarterCircle
// Frames: ['◐', '◓', '◑', '◒']

// 8-frame Braille (recommended for longer ops)
cli.spinners.braille
// Frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧']

// 10-frame dots
cli.spinners.dots

// 4-frame line (classic)
cli.spinners.line
// Frames: ['−', '\\', '|', '/']

// 8-frame arrow (directional)
cli.spinners.arrow
// Frames: ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙']

// Pulsing robot emoji
cli.spinners.robot

// 2-frame hourglass
cli.spinners.hourglass
```

### 3.4 Advanced: Multi-Step Workflow

```javascript
const cli = require('./assets/components/cli-states');

async function setupJSEBot() {
  const steps = [
    {
      name: 'Initializing JSEBot',
      fn: async () => {
        await initialize();
      },
      successMsg: 'Initialized'
    },
    {
      name: 'Connecting to channels',
      fn: async () => {
        await connectChannels();
      },
      successMsg: 'Connected'
    },
    {
      name: 'Loading plugins',
      fn: async () => {
        await loadPlugins();
      },
      successMsg: 'Plugins loaded'
    },
    {
      name: 'Verifying configuration',
      fn: async () => {
        await verifyConfig();
      },
      successMsg: 'Configuration verified'
    }
  ];
  
  try {
    await cli.runWorkflow(steps);
    cli.showSuccess('JSEBot is ready!');
  } catch (error) {
    cli.showError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

setupJSEBot();
```

### 3.5 Thinking/Loading States

```javascript
const cli = require('./assets/components/cli-states');

// Show thinking indicator during AI processing
const thinking = cli.createSpinner(
  cli.thinkingDots(0), 
  'braille'
);
thinking.start();

// Update thinking text with animation
let frame = 0;
const interval = setInterval(() => {
  thinking.text = cli.thinkingDots(frame++);
}, 400);

// Simulate AI thinking...
await aiResponse();

// Stop and show result
clearInterval(interval);
thinking.succeed('Response ready');
```

### 3.6 Progress Indicators

```javascript
const cli = require('./assets/components/cli-states');

// Show progress bar
for (let i = 0; i <= 100; i += 10) {
  console.clear();
  console.log(cli.progressBar(i, 20));
  await new Promise(resolve => setTimeout(resolve, 100));
}

// Show animated loading bar
for (let frame = 0; frame < 20; frame++) {
  process.stdout.write('\r' + cli.loadingBar(frame, 20));
  await new Promise(resolve => setTimeout(resolve, 50));
}
```

---

## 4. Theme Integration

### 4.1 Dark Mode Detection

```javascript
// Detect OS preference
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Listen for changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  const isDark = e.matches;
  updateTheme(isDark);
});
```

### 4.2 Theme Colors

**Dark Mode:**
```
Primary: #7dd3fc (cyan)
Accent: #0ea5e9 (bright cyan)
Background: #0f172a (dark blue-black)
Text: #f1f5f9 (almost white)
```

**Light Mode:**
```
Primary: #0284c7 (darker blue)
Accent: #0369a1 (steel blue)
Background: #f8fafc (almost white)
Text: #0f172a (dark)
```

### 4.3 CSS Variables

```css
:root {
  --jsebot-primary: #7dd3fc;
  --jsebot-accent: #0ea5e9;
  --jsebot-background: #0f172a;
  --jsebot-text: #f1f5f9;
  --jsebot-success: #10b981;
  --jsebot-error: #ef4444;
  --jsebot-warning: #f59e0b;
}

@media (prefers-color-scheme: light) {
  :root {
    --jsebot-primary: #0284c7;
    --jsebot-accent: #0369a1;
    --jsebot-background: #f8fafc;
    --jsebot-text: #0f172a;
    --jsebot-success: #059669;
    --jsebot-error: #dc2626;
    --jsebot-warning: #d97706;
  }
}
```

---

## 5. Implementation Checklist

### Phase 2A: Splash Screens
- [ ] Import desktop splash SVGs into app
- [ ] Import mobile splash SVGs for responsive design
- [ ] Implement auto-dismiss after 1-2 seconds
- [ ] Add fade-out animation
- [ ] Test in dark/light modes
- [ ] Test responsive behavior

### Phase 2B: Onboarding Flow
- [ ] Render onboarding.json screens dynamically
- [ ] Implement form validation (Setup screen)
- [ ] Implement checklist selection (Config screen)
- [ ] Save configuration to `~/.jsebot/config.json`
- [ ] Add Rubi avatar animation (wave, thinking, smile, etc.)
- [ ] Add navigation between screens
- [ ] Skip option (back to main app)
- [ ] Test form persistence

### Phase 2C: CLI States
- [ ] Import cli-states.js module
- [ ] Install `ora` dependency: `npm install ora`
- [ ] Implement welcome banner on startup
- [ ] Add spinners to long-running operations
- [ ] Implement success/error messages
- [ ] Add progress indicators
- [ ] Test in different terminal types (bash, zsh, PowerShell)
- [ ] Test color support

### Phase 2D: Documentation & Export
- [ ] Commit all Phase 2 assets to git
- [ ] Update README with Phase 2 features
- [ ] Generate PNG exports from SVG (optional)
- [ ] Add integration examples to docs
- [ ] Update HEARTBEAT.md

---

## 6. PNG Export (Optional)

### Using ImageMagick

```bash
# Export dark splash to PNG
convert -density 150 assets/screens/dark/splash-dark.svg \
  assets/screens/dark/splash-dark.png

# Export light splash to PNG
convert -density 150 assets/screens/light/splash-light.svg \
  assets/screens/light/splash-light.png

# Export mobile variants
convert -density 150 assets/screens/dark/splash-mobile-dark.svg \
  assets/screens/dark/splash-mobile-dark.png

convert -density 150 assets/screens/light/splash-mobile-light.svg \
  assets/screens/light/splash-mobile-light.png
```

### Using Node.js + Sharp

```javascript
const sharp = require('sharp');

async function exportPNGs() {
  const svgs = [
    'assets/screens/dark/splash-dark.svg',
    'assets/screens/light/splash-light.svg',
    'assets/screens/dark/splash-mobile-dark.svg',
    'assets/screens/light/splash-mobile-light.svg'
  ];
  
  for (const svg of svgs) {
    const output = svg.replace('.svg', '.png');
    await sharp(svg)
      .png({ compressionLevel: 9 })
      .toFile(output);
    console.log(`✓ ${output}`);
  }
}

exportPNGs();
```

---

## 7. Testing

### Manual Testing Checklist

- [ ] **Desktop Dark Mode:** Load splash, check colors, dismiss timing
- [ ] **Desktop Light Mode:** Load splash, check readability
- [ ] **Mobile Dark Mode:** Portrait orientation, text size, features layout
- [ ] **Mobile Light Mode:** Contrast, readability on small screens
- [ ] **Onboarding:** All 4 screens, form submission, config save
- [ ] **CLI Spinners:** All 7 spinner types, visual clarity
- [ ] **Errors:** Error message display, color contrast
- [ ] **Success:** Success message display, emoji rendering
- [ ] **Responsive:** Window resize, orientation change
- [ ] **Terminal Types:** macOS, Linux, Windows PowerShell

### Automated Testing Example

```typescript
// __tests__/onboarding.test.ts
import { render, screen } from '@testing-library/react';
import OnboardingFlow from '../src/components/OnboardingFlow';

describe('OnboardingFlow', () => {
  test('renders welcome screen on first load', () => {
    render(<OnboardingFlow />);
    expect(screen.getByText('Welcome to JSEBot!')).toBeInTheDocument();
  });
  
  test('navigates between screens', async () => {
    const { user } = render(<OnboardingFlow />);
    const nextButton = screen.getByText('Get Started');
    await user.click(nextButton);
    expect(screen.getByText('Quick Setup')).toBeInTheDocument();
  });
  
  test('saves configuration to file', async () => {
    // Mock file system
    // Verify config is saved correctly
  });
});
```

---

## 8. Performance Notes

- **SVG Size:** ~3-4 KB per screen (already optimized)
- **Load Time:** <200ms for all assets
- **Memory:** <1 MB total Phase 2 assets
- **CLI States:** Zero dependencies (optional `ora` for enhanced spinners)
- **Onboarding JSON:** ~8 KB (easily cached)

---

## 9. Future Phases

### Phase 3: Animation & Motion
- Animated SVG frames (spinning robot, blinking eyes)
- Smooth transitions between screens
- Bounce/wave arm animations
- Progress bar animation

### Phase 4: TUI (Terminal User Interface)
- Full interactive CLI with keyboard navigation
- Rich terminal UI library (blessed, ink, etc.)
- Multi-column layouts
- Interactive prompts with validation

### Phase 5: Platform Variants
- macOS menu bar integration
- Windows taskbar icon
- Linux systray support
- Android/iOS native splash screens

---

## Troubleshooting

### SVG Not Displaying
- Check SVG namespace: `xmlns="http://www.w3.org/2000/svg"`
- Verify viewBox attributes
- Ensure gradients have unique IDs

### Colors Not Appearing
- Check CSS filter values
- Verify ANSI color codes in terminal
- Test on different terminal emulators

### Onboarding Not Saving
- Ensure `~/.jsebot/` directory exists
- Check file permissions (755 for dir, 644 for file)
- Verify JSON serialization

### Spinners Look Broken
- Install `ora`: `npm install ora`
- Test on modern terminal (not IE11, etc.)
- Check terminal color support: `echo $TERM`

---

## Support & Feedback

For issues or feature requests related to Phase 2:
1. Check this integration guide
2. Review code examples in the assets/
3. Open an issue in the JSEclaw repository
4. Contact Eric with screenshots/videos

---

_JSEBot Phase 2 Integration Complete ✓_  
_Ready for Phase 3: Animation & Motion_
