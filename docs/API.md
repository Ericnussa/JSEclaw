# API Reference

Complete reference for JSEBot's core APIs: Sprite Engine, CLI Renderer, and Hardware Interfaces.

## Table of Contents

- [Sprite Engine](#sprite-engine)
- [CLI Renderer](#cli-renderer)
- [Hardware APIs](#hardware-apis)
- [Examples](#examples)

---

## Sprite Engine

Zero-dependency animation engine for the Rubi avatar.

**File:** `assets/components/sprite-engine.js`  
**Size:** 6.3 KB  
**Dependencies:** None (pure JavaScript)

### Initialization

```javascript
const engine = new SpriteEngine(options);

// Options (all optional)
{
  baseUrl: '/assets/sprites/',     // Where sprites are stored
  cacheSize: 50,                   // LRU cache size
  fallbackAscii: true,             // Use ASCII on errors
  frameRate: 100,                  // ms per frame
}
```

### Methods

#### `async preloadAll()`

Load all sprites for the target platform.

```javascript
await engine.preloadAll();
// Returns: Promise<void>
```

#### `transitionTo(state, options)`

Transition to a new animation state.

```javascript
engine.transitionTo("talking", {
  frameDuration: 50, // ms per frame
  loop: true, // Repeat animation
  queue: false, // Queue vs. interrupt
});
```

**Valid states:**

- `idle` — Waiting for input
- `blink` — Eye movement (100-200ms)
- `talking` — Speaking (30-50ms/frame)
- `thinking` — Processing (100ms/frame)
- `success` — Task complete (300-500ms)
- `error` — Error state (200-300ms)

#### `getAnimationInfo()`

Get current animation state and frame information.

```javascript
const info = engine.getAnimationInfo();

// Returns:
{
  state: 'talking',
  frame: 3,
  totalFrames: 12,
  duration: 600,  // Total ms for animation
  isPlaying: true,
}
```

#### `render(target)`

Render the current frame to a target (DOM, canvas, terminal).

```javascript
// To DOM element
engine.render(document.getElementById("avatar"));

// To canvas
const canvas = document.getElementById("canvas");
engine.render(canvas);

// To terminal (Node.js)
engine.render("terminal");
```

#### `stop()`

Stop the current animation.

```javascript
engine.stop();
```

#### `destroy()`

Clean up resources and destroy the engine.

```javascript
engine.destroy();
```

### Events

Listen for animation events:

```javascript
engine.on("stateChange", (newState, oldState) => {
  console.log(`Transitioned from ${oldState} to ${newState}`);
});

engine.on("frameChange", (frameNum, totalFrames) => {
  console.log(`Frame ${frameNum}/${totalFrames}`);
});

engine.on("complete", (state) => {
  console.log(`Animation ${state} completed`);
});

engine.on("error", (error) => {
  console.error("Animation error:", error);
});
```

### Example

```javascript
import SpriteEngine from "./sprite-engine.js";

const engine = new SpriteEngine({
  baseUrl: "/assets/sprites/",
  cacheSize: 50,
});

// Preload sprites
await engine.preloadAll();

// Listen for state changes
engine.on("stateChange", (newState) => {
  console.log(`Now ${newState}`);
});

// Animate
engine.transitionTo("talking", { frameDuration: 50 });
engine.render(document.getElementById("avatar"));

// Later...
engine.transitionTo("thinking", { loop: true });
```

---

## CLI Renderer

Terminal display for the Rubi avatar with ASCII fallback.

**File:** `assets/components/cli-renderer.js`  
**Size:** 7.5 KB  
**Dependencies:** None

### Initialization

```javascript
const renderer = new CLIRenderer(engine, options);

// Options
{
  width: 80,              // Terminal width
  height: 24,             // Terminal height
  useAnsi: true,          // Use ANSI colors
  fallbackAscii: true,    // ASCII if no sprite
  clearScreen: true,      // Clear between frames
}
```

### Methods

#### `render()`

Render current frame to terminal.

```javascript
renderer.render();
// Outputs to stdout
```

#### `setDimensions(width, height)`

Update terminal dimensions.

```javascript
renderer.setDimensions(100, 30);
```

#### `getAscii(state)`

Get ASCII art for a state (fallback).

```javascript
const ascii = renderer.getAscii("thinking");
console.log(ascii);

// Outputs:
//
//    ╔═══════╗
//    ║ Rubi  ║
//    ║ 🤔    ║
//    ╚═══════╝
```

#### `start()`

Start continuous rendering.

```javascript
renderer.start();
// Re-renders on each sprite frame
```

#### `stop()`

Stop continuous rendering.

```javascript
renderer.stop();
```

### Example

```javascript
import SpriteEngine from "./sprite-engine.js";
import CLIRenderer from "./cli-renderer.js";

const engine = new SpriteEngine();
await engine.preloadAll();

const renderer = new CLIRenderer(engine, {
  width: 80,
  height: 24,
  useAnsi: true,
});

// Display avatar
renderer.start();

// Change state
engine.transitionTo("talking");
// Terminal auto-updates

// Stop rendering
renderer.stop();
```

---

## Hardware APIs

### Pi 5 Handheld

Full-screen avatar rendering on a 320×480 touchscreen.

**Target:** Raspberry Pi 5 + 8" display  
**File:** `html/demo-handheld.html`

#### Screen Dimensions

- **Resolution:** 1280×800 (effective), 320×480 (avatar)
- **DPI:** ~216 (5.5" screen)
- **Refresh Rate:** 30 FPS
- **Touch:** 10-point multi-touch (capacitive)

#### API

```javascript
// Initialize for handheld
const handheld = new HandheldDisplay({
  width: 320,
  height: 480,
  fps: 30,
  useGPU: true, // Hardware acceleration
});

await handheld.initialize();
await handheld.loadAvatar("rubi");

// Display states
handheld.show("idle");
handheld.show("talking");
handheld.show("thinking");

// Touch interaction
handheld.on("tap", (x, y) => {
  console.log(`Tapped at ${x}, ${y}`);
});

handheld.on("swipe", (direction) => {
  console.log(`Swiped ${direction}`);
});
```

**Performance Metrics:**

- **Memory:** ~50 MB (sprite cache)
- **CPU:** <15% (idle), <40% (animation)
- **Startup:** ~2 seconds

### M5Stack CoreS3

Dashboard display with system status.

**Target:** M5Stack CoreS3 (2.4" IPS)  
**File:** `html/demo-coresia.html`

#### Screen Dimensions

- **Resolution:** 320×240
- **DPI:** ~170
- **Refresh Rate:** 25 FPS
- **Touch:** 2-point multi-touch

#### API

```javascript
const dashboard = new CoreS3Dashboard({
  width: 320,
  height: 240,
  fps: 25,
});

// Initialize
await dashboard.initialize();

// Display sections
dashboard.setAvatar("rubi");
dashboard.setStatus("idle");
dashboard.setTime(new Date());
dashboard.setWeather({ temp: 72, condition: "sunny" });

// Action buttons
dashboard.addButton({
  label: "Send",
  x: 10,
  y: 10,
  width: 60,
  height: 40,
  onClick: () => {
    /* ... */
  },
});

// Quick actions
dashboard.showNotification("New message from John");
dashboard.playSound("notification.wav");
```

**Performance Metrics:**

- **Memory:** ~30 MB
- **CPU:** <20% (idle), <35% (animation)
- **Battery:** ~6 hours active use

### Web Browser

HTML5 canvas rendering for desktop/mobile browsers.

**File:** `html/demo-handheld.html`, `html/demo-coresia.html`

#### API

```javascript
const canvas = document.getElementById("avatar-canvas");
const ctx = canvas.getContext("2d");

const webAvatar = new WebAvatar(canvas, {
  width: 320,
  height: 480,
  fps: 30,
  scale: 1.0, // Scale factor
});

// Display
await webAvatar.initialize();
webAvatar.setAvatar("rubi");
webAvatar.setState("talking");

// Responsive
window.addEventListener("resize", () => {
  webAvatar.setScale(window.innerWidth / 1920);
});

// Keyboard interaction
document.addEventListener("keydown", (e) => {
  if (e.key === " ") webAvatar.speak("Hello!");
});
```

---

## Examples

### Example 1: Terminal CLI Demo

```javascript
import SpriteEngine from "./assets/components/sprite-engine.js";
import CLIRenderer from "./assets/components/cli-renderer.js";

async function runCLIDemo() {
  // Create engine and renderer
  const engine = new SpriteEngine({
    baseUrl: "./assets/sprites/",
    cacheSize: 50,
  });

  const renderer = new CLIRenderer(engine, {
    width: process.stdout.columns,
    height: process.stdout.rows,
  });

  // Preload sprites
  console.log("Loading sprites...");
  await engine.preloadAll();

  // Display sequence
  const states = ["idle", "blink", "thinking", "talking", "success"];

  for (const state of states) {
    console.clear();
    console.log(`\n$State: ${state}\n`);

    engine.transitionTo(state);
    renderer.render();

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  engine.destroy();
}

runCLIDemo().catch(console.error);
```

### Example 2: Web Browser Avatar

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      canvas {
        border: 1px solid #ccc;
      }
      button {
        padding: 10px;
        margin: 5px;
      }
    </style>
  </head>
  <body>
    <canvas id="avatar" width="320" height="480"></canvas>

    <div>
      <button onclick="idle()">Idle</button>
      <button onclick="talk()">Talk</button>
      <button onclick="think()">Think</button>
      <button onclick="celebrate()">Success</button>
    </div>

    <script src="./assets/components/sprite-engine.js"></script>
    <script>
      const canvas = document.getElementById("avatar");
      const engine = new SpriteEngine({
        baseUrl: "./assets/sprites/",
      });

      (async () => {
        await engine.preloadAll();
        engine.transitionTo("idle");
        engine.render(canvas);
      })();

      function idle() {
        engine.transitionTo("idle");
      }
      function talk() {
        engine.transitionTo("talking");
      }
      function think() {
        engine.transitionTo("thinking");
      }
      function celebrate() {
        engine.transitionTo("success");
      }
    </script>
  </body>
</html>
```

### Example 3: Node.js Integration

```javascript
import { SpriteEngine } from "./assets/components/sprite-engine.js";
import { CLIRenderer } from "./assets/components/cli-renderer.js";

// Create agent with visual feedback
class VisualAgent {
  constructor() {
    this.engine = new SpriteEngine();
    this.renderer = new CLIRenderer(this.engine);
  }

  async initialize() {
    await this.engine.preloadAll();
  }

  async process(message) {
    // Show thinking state
    this.engine.transitionTo("thinking");
    this.renderer.start();

    // Process the message (simulate)
    const response = await this.llm.complete(message);

    // Show success
    this.engine.transitionTo("success");
    await this.sleep(1000);

    // Return to idle
    this.engine.transitionTo("idle");
    this.renderer.stop();

    return response;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

---

## Performance Tips

1. **Preload all sprites** — Call `preloadAll()` once on startup
2. **Use caching** — Set `cacheSize` to match your memory budget
3. **Batch renders** — Use `requestAnimationFrame` on the web
4. **Lazy load** — Load sprites only when needed
5. **Use canvas** — Faster than DOM for complex animations

---

## Browser Compatibility

| Feature     | Chrome | Safari | Firefox | Node.js |
| ----------- | ------ | ------ | ------- | ------- |
| Canvas      | ✅     | ✅     | ✅      | N/A     |
| ANSI Colors | N/A    | N/A    | N/A     | ✅      |
| Audio       | ✅     | ✅     | ✅      | ⚠️      |
| Touch       | ✅     | ✅     | ✅      | N/A     |

---

## Common Patterns

### Waiting for Animation to Complete

```javascript
engine.on("complete", () => {
  console.log("Animation finished");
  engine.transitionTo("idle");
});

engine.transitionTo("talking", { loop: false });
```

### Responsive Sizing

```javascript
// Web
function handleResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  engine.setSize(width, height);
}

window.addEventListener("resize", handleResize);
```

### Graceful Fallback

```javascript
try {
  await engine.preloadAll();
  engine.render(canvas);
} catch (error) {
  console.warn("Sprites unavailable, using ASCII");
  renderer.useASCII = true;
  renderer.render();
}
```

---

## Support

- **Issues:** [GitHub Issues](https://github.com/Ericnussa/JSEclaw/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Ericnussa/JSEclaw/discussions)
- **Email:** [api@jsebot.dev](mailto:api@jsebot.dev)
