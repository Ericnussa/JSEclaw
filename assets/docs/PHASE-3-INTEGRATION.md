# Phase 3: Rubi Avatar Animation - Integration Guide

**Status:** ✅ COMPLETE  
**Version:** 1.0.0  
**Created:** March 2026  
**Phase:** 3 of 4

---

## Overview

This guide shows how to integrate Rubi's animated avatar into your JSEBot applications across all platforms: CLI, Pi 5 handheld, and M5Stack CoreS3 dashboard.

## Quick Start

### 1. Load Components (Node.js)

```javascript
// Import animation engine
const SpriteEngine = require('./assets/components/sprite-engine.js');
const CLIRenderer = require('./assets/components/cli-renderer.js');

// Initialize
const engine = new SpriteEngine({
  spritePath: './assets/sprites/',
  frameTime: 120,
});

const renderer = new CLIRenderer({
  useColor: true,
  useASCII: false, // Use full Unicode
});

// Preload all sprites
await engine.preloadAll();
console.log('✓ Rubi loaded and ready!');
```

### 2. Load Components (Browser)

```html
<!-- Include scripts -->
<script src="assets/components/sprite-engine.js"></script>
<script src="assets/components/cli-renderer.js"></script>
<script src="assets/components/pi-handheld.js"></script>
<script src="assets/components/coresia-dashboard.js"></script>

<!-- Initialize -->
<script>
  const engine = new SpriteEngine({
    spritePath: './assets/sprites/',
  });
  
  await engine.preloadAll();
</script>
```

---

## Platform-Specific Integration

### A. CLI Terminal Integration

Display animated Rubi in the terminal during different app states.

#### Example: Startup Sequence

```javascript
const SpriteEngine = require('./assets/components/sprite-engine.js');
const CLIRenderer = require('./assets/components/cli-renderer.js');

async function initializeApp() {
  const engine = new SpriteEngine();
  const renderer = new CLIRenderer();

  // Show startup screen
  renderer.showStartup();

  // Load sprites
  console.log('\n  Loading Rubi avatar...');
  await engine.preloadAll();
  renderer.printMessage('Avatar loaded', 'success');

  // Show ready state
  engine.transitionTo('idle');
  renderer.showPrompt();

  return { engine, renderer };
}
```

#### Example: Processing State

```javascript
async function processUserInput(userMessage, engine, renderer) {
  // Show thinking animation
  engine.transitionTo('thinking');
  renderer.showThinking();

  // Simulate AI processing
  const response = await getAIResponse(userMessage);

  // Show success and transition to talking
  engine.transitionTo('talking');
  
  // Play response (would be real TTS in production)
  await playAudio(response);

  // Return to idle
  engine.transitionTo('success');
  renderer.showSuccess('Response sent!');
  
  setTimeout(() => {
    engine.transitionTo('idle');
  }, 1000);
}
```

#### Example: Progress Display

```javascript
function showProgressAnimation(current, total, label) {
  const renderer = new CLIRenderer();
  
  for (let i = current; i <= total; i++) {
    renderer.showProgress(i, total, label);
    // Wait 100ms between frames
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
```

#### Full CLI Demo

```javascript
#!/usr/bin/env node

const SpriteEngine = require('./assets/components/sprite-engine.js');
const CLIRenderer = require('./assets/components/cli-renderer.js');

async function main() {
  const engine = new SpriteEngine();
  const renderer = new CLIRenderer();

  try {
    // Startup
    renderer.showStartup();
    await engine.preloadAll();
    renderer.printMessage('Rubi initialized', 'success');

    // Demo states
    engine.transitionTo('idle');
    await sleep(2000);

    // Blink
    renderer.showLoading('Generating response...');
    engine.transitionTo('thinking');
    await sleep(3000);

    // Talking (simulated)
    engine.transitionTo('talking');
    renderer.printMessage('Playing response audio...', 'info');
    await sleep(2000);

    // Success
    engine.transitionTo('success');
    renderer.showSuccess('All done!');
  } catch (error) {
    renderer.showError(error.message);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();
```

---

### B. Pi 5 Handheld Integration

Display full animated Rubi avatar on 320×480 screen.

#### Example: HTML Canvas Setup

```html
<!DOCTYPE html>
<html>
<head>
  <title>Rubi Handheld</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #0a0e27;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    canvas {
      border: 2px solid #00d4ff;
      image-rendering: pixelated;
    }
  </style>
</head>
<body>
  <canvas id="handheld-canvas"></canvas>
  <script src="assets/components/sprite-engine.js"></script>
  <script src="assets/components/pi-handheld.js"></script>
  <script src="js/handheld-app.js"></script>
</body>
</html>
```

#### Example: Handheld Application

```javascript
// js/handheld-app.js

class HandheldApp {
  constructor() {
    this.engine = new SpriteEngine({
      spritePath: './assets/sprites/',
    });
    this.renderer = new PiHandheldRenderer({
      canvasId: 'handheld-canvas',
      fps: 30, // Target 30 FPS on Pi 5
    });
  }

  async initialize() {
    // Initialize renderer
    if (!this.renderer.initialize()) {
      console.error('Failed to initialize handheld display');
      return false;
    }

    // Preload sprites
    await this.engine.preloadAll();
    console.log('✓ Handheld app ready');

    // Start rendering loop
    this.renderer.render();

    return true;
  }

  async showState(stateName) {
    this.engine.transitionTo(stateName);
    this.renderer.setState(stateName);
  }

  async runDemo() {
    // Idle
    await this.showState('idle');
    await sleep(2000);

    // Thinking
    await this.showState('thinking');
    await sleep(3000);

    // Talking
    await this.showState('talking');
    await sleep(2000);

    // Success
    await this.showState('success');
    await sleep(1000);

    // Back to idle
    await this.showState('idle');
  }
}

// Initialize app
const app = new HandheldApp();
app.initialize().then(() => {
  app.runDemo();
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

#### Example: Responsive Handlers

```javascript
// Touch input handlers for Pi 5 handheld

renderer.canvas.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  const rect = renderer.canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  // Check if settings button clicked
  if (isInButtonZone(x, y, 'settings')) {
    showSettingsMenu();
  }
  // Check if refresh button clicked
  else if (isInButtonZone(x, y, 'refresh')) {
    app.runDemo();
  }
});

function isInButtonZone(x, y, button) {
  const buttonY = 225;
  const buttonHeight = 50;

  if (y < buttonY || y > buttonY + buttonHeight) return false;

  if (button === 'settings') {
    return x < 160;
  } else if (button === 'refresh') {
    return x > 160;
  }

  return false;
}
```

---

### C. CoreS3 Dashboard Integration

Display scaled Rubi avatar on 320×240 M5Stack CoreS3 display.

#### Example: Browser-Based Dashboard

```html
<!DOCTYPE html>
<html>
<head>
  <title>JSEBot CoreS3 Dashboard</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background: #0a0e27;
      font-family: monospace;
    }
    canvas {
      display: block;
      background: #0a0e27;
      border: 1px solid #333;
    }
  </style>
</head>
<body>
  <canvas id="coresia-canvas" width="320" height="240"></canvas>
  <script src="assets/components/coresia-dashboard.js"></script>
  <script src="js/coresia-app.js"></script>
</body>
</html>
```

#### Example: CoreS3 Dashboard App

```javascript
// js/coresia-app.js

class CoreS3App {
  constructor() {
    this.dashboard = new CoreS3Dashboard({
      width: 320,
      height: 240,
      theme: 'dark',
      updateInterval: 1000, // Update metrics every 1 sec
    });

    this.metrics = {
      cpu: 25,
      memory: 45,
      network: 'online',
      modelRunning: 'Qwen-1.7B',
    };
  }

  async initialize() {
    // Initialize display
    if (!this.dashboard.initialize()) {
      console.error('Failed to initialize CoreS3 display');
      return false;
    }

    // Load CoreS3-specific sprites (320x240)
    await this.dashboard.loadSprite('idle.png');
    await this.dashboard.loadSprite('blink.png');
    await this.dashboard.loadSprite('mouth_open.png');
    await this.dashboard.loadSprite('mouth_closed.png');

    console.log('✓ CoreS3 dashboard ready');

    // Start rendering
    this.dashboard.render();

    // Start metrics update loop
    this.startMetricsLoop();

    return true;
  }

  startMetricsLoop() {
    setInterval(() => {
      // Fetch real system metrics
      this.updateMetrics();

      // Update dashboard
      this.dashboard.updateMetrics(this.metrics);
    }, 1000);
  }

  updateMetrics() {
    // Simulate system metrics (would be real in production)
    this.metrics.cpu = Math.floor(Math.random() * 80);
    this.metrics.memory = Math.floor(Math.random() * 60);
    this.metrics.network = Math.random() > 0.1 ? 'online' : 'offline';
  }

  async showState(state) {
    this.dashboard.setState(state);
  }

  showAlert(title, message) {
    this.dashboard.showInfo(title, {
      message: message,
      time: new Date().toLocaleTimeString(),
    });

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      this.dashboard.setState('idle');
    }, 3000);
  }
}

// Initialize
const app = new CoreS3App();
app.initialize().then(() => {
  console.log('CoreS3 dashboard active');

  // Demo states
  app.showState('idle');
});

// Example: Show notification
// app.showAlert('Update Available', 'JSEBot v2026.3.3 ready');
```

#### Example: System Status Integration

```javascript
// Integrate with system monitoring

async function startDashboardWithMonitoring() {
  const app = new CoreS3App();
  await app.initialize();

  // Listen for system events
  process.on('warning', (warning) => {
    app.showAlert('⚠️ Warning', warning.message);
    app.showState('warning');
  });

  // Monitor AI model status
  aiEngine.on('processing', () => {
    app.showState('thinking');
  });

  aiEngine.on('speaking', () => {
    app.showState('talking');
  });

  aiEngine.on('done', () => {
    app.showState('success');
    setTimeout(() => app.showState('idle'), 1000);
  });

  aiEngine.on('error', (error) => {
    app.showAlert('❌ Error', error.message);
    app.showState('error');
  });
}
```

---

## Advanced Integration Patterns

### A. State Machine (Multi-Step Workflows)

```javascript
class AnimationSequence {
  constructor(engine) {
    this.engine = engine;
    this.queue = [];
  }

  add(state, duration = 1000) {
    this.queue.push({ state, duration });
    return this;
  }

  async play() {
    for (const item of this.queue) {
      this.engine.transitionTo(item.state);
      await sleep(item.duration);
    }
  }
}

// Usage:
const sequence = new AnimationSequence(engine);
sequence
  .add('idle', 500)
  .add('thinking', 2000)
  .add('talking', 3000)
  .add('success', 500)
  .add('idle', 1000);

await sequence.play();
```

### B. Event-Driven Animation

```javascript
class AnimatedEventBus {
  constructor(engine) {
    this.engine = engine;
    this.handlers = {};
  }

  on(event, handler) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  emit(event, ...args) {
    if (this.handlers[event]) {
      this.handlers[event].forEach(handler => handler(...args));
    }
  }
}

// Usage:
const events = new AnimatedEventBus(engine);

events.on('input-received', () => {
  engine.transitionTo('thinking');
});

events.on('response-ready', () => {
  engine.transitionTo('talking');
});

events.on('done', () => {
  engine.transitionTo('success');
  setTimeout(() => engine.transitionTo('idle'), 1000);
});

// Trigger events
events.emit('input-received');
// ... process ...
events.emit('response-ready');
// ... play audio ...
events.emit('done');
```

### C. Conditional Animation Based on Context

```javascript
class ContextualAnimator {
  constructor(engine) {
    this.engine = engine;
    this.context = {};
  }

  setContext(key, value) {
    this.context[key] = value;
  }

  async transitionWithContext(targetState) {
    // Choose animation based on context
    if (this.context.isError) {
      this.engine.transitionTo('error');
    } else if (this.context.isLoading) {
      this.engine.transitionTo('thinking');
    } else if (this.context.isSpeaking) {
      this.engine.transitionTo('talking');
    } else if (this.context.isSuccess) {
      this.engine.transitionTo('success');
    } else {
      this.engine.transitionTo(targetState || 'idle');
    }
  }
}
```

---

## Performance Optimization

### Sprite Preloading Strategy

```javascript
// Preload only required sprites for faster startup
async function preloadMinimal(engine) {
  await Promise.all([
    engine.loadSprite('idle.png'),
    engine.loadSprite('blink.png'),
  ]);
  console.log('Minimal sprites preloaded');
}

// Lazy-load others
async function preloadRemaining(engine) {
  await Promise.all([
    engine.loadSprite('mouth_open.png'),
    engine.loadSprite('mouth_closed.png'),
  ]);
}

// Usage:
await preloadMinimal(engine);
engine.transitionTo('idle'); // Ready immediately

// Load rest in background
preloadRemaining(engine).then(() => {
  console.log('All sprites ready');
});
```

### Memory-Conscious Rendering (Pi/CoreS3)

```javascript
class LightweightRenderer {
  constructor(options = {}) {
    this.maxCacheSize = options.maxCacheSize || 10 * 1024 * 1024;
    this.targetFPS = options.targetFPS || 30;
    this.sprites = {};
    this.frameCount = 0;
  }

  render(sprite) {
    // Throttle rendering to target FPS
    if (this.frameCount % Math.ceil(60 / this.targetFPS) !== 0) {
      this.frameCount++;
      return;
    }
    this.frameCount++;

    // Clear old cache if needed
    if (this.getCacheSize() > this.maxCacheSize * 0.8) {
      this.clearOldestSprite();
    }

    // Render sprite
    // ... drawing code ...
  }

  getCacheSize() {
    let total = 0;
    Object.values(this.sprites).forEach(sprite => {
      total += sprite.width * sprite.height * 4; // RGBA
    });
    return total;
  }

  clearOldestSprite() {
    const oldestKey = Object.keys(this.sprites)[0];
    delete this.sprites[oldestKey];
  }
}
```

---

## Testing

### Unit Test Example (Jest)

```javascript
describe('SpriteEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new SpriteEngine();
  });

  test('should load sprite', async () => {
    const sprite = await engine.loadSprite('idle.png');
    expect(sprite).toBeDefined();
  });

  test('should transition between states', () => {
    engine.transitionTo('idle');
    expect(engine.currentState).toBe('idle');

    engine.transitionTo('thinking');
    expect(engine.currentState).toBe('thinking');
  });

  test('should return correct frame', () => {
    engine.transitionTo('idle');
    const frame = engine.getCurrentFrame();
    expect(frame).toBe('idle.png');
  });
});
```

### Integration Test Example

```javascript
describe('CLI Integration', () => {
  test('should show startup sequence', async () => {
    const engine = new SpriteEngine();
    const renderer = new CLIRenderer();

    const consoleSpy = jest.spyOn(console, 'log');

    renderer.showStartup();
    await engine.preloadAll();
    renderer.showPrompt();

    expect(consoleSpy).toHaveBeenCalled();
  });
});
```

---

## Troubleshooting

### Issue: Sprites not loading

**Solution:** Check sprite path and file existence
```javascript
// Debug: Check loaded sprites
console.log(engine.loadedSprites);
console.log(engine.spritePath);

// Test file access
fetch(engine.spritePath + 'idle.png')
  .then(r => console.log('Sprite accessible:', r.ok))
  .catch(e => console.error('Sprite loading failed:', e));
```

### Issue: Animations stuttering on Pi 5

**Solution:** Reduce FPS and optimize rendering
```javascript
// Lower FPS for Pi 5
const renderer = new PiHandheldRenderer({
  fps: 25, // Reduce to 25 FPS
});

// Or use less frequent updates
renderer.frameTime = 50; // 50ms = 20 FPS
```

### Issue: CoreS3 display flickering

**Solution:** Use double buffering or canvas optimization
```javascript
// Use offscreen canvas for smooth rendering
const offscreen = new OffscreenCanvas(320, 240);
const offCtx = offscreen.getContext('2d');

// Draw to offscreen, then blit to main canvas
mainCtx.drawImage(offscreen, 0, 0);
```

---

## File Structure

```
JSEclaw/
├── assets/
│   ├── components/
│   │   ├── sprite-engine.js        # Core animation engine
│   │   ├── cli-renderer.js         # Terminal display
│   │   ├── pi-handheld.js          # Pi 5 renderer
│   │   └── coresia-dashboard.js    # CoreS3 dashboard
│   ├── sprites/
│   │   ├── idle.png                # 320x480
│   │   ├── blink.png
│   │   ├── mouth_open.png
│   │   ├── mouth_closed.png
│   │   └── cores3/                 # 320x240 variants
│   │       ├── idle.png
│   │       ├── blink.png
│   │       ├── mouth_open.png
│   │       └── mouth_closed.png
│   └── docs/
│       ├── PHASE-3-SPRITE-TIMINGS.md
│       └── PHASE-3-INTEGRATION.md
├── js/
│   ├── demo-avatar-cli.js          # CLI demo
│   ├── demo-handheld.js            # Pi 5 demo
│   └── demo-coresia.js             # CoreS3 demo
└── [other JSEclaw files...]
```

---

## Next Steps

1. **Test on Hardware:** Run demos on Pi 5 and CoreS3 to validate performance
2. **Adjust Timings:** Fine-tune frame rates based on actual hardware performance
3. **Add Features:** Emotion states, speech sync, gesture animations
4. **Document Results:** Update HEARTBEAT.md with Phase 3 completion

---

_Last updated: March 2026 | Phase 3 Integration Guide v1.0_
