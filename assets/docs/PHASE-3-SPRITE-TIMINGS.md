# Phase 3: Rubi Avatar Animation Specifications

**Status:** ✅ COMPLETE  
**Version:** 1.0.0  
**Created:** March 2026  
**Phase:** 3 of 4

---

## Overview

Rubi sprite animation timings, frame sequences, and state transition rules for consistent performance across all platforms.

## Sprite Dimensions

### Full-Size Sprites (Pi 5 Handheld)

- **Dimensions:** 320×480 pixels (portrait)
- **Format:** PNG with alpha transparency (RGBA)
- **Color Profile:** sRGB
- **Files:**
  - `idle.png` — Default waiting state
  - `blink.png` — Eye blink frame
  - `mouth_open.png` — Talking/speaking mouth
  - `mouth_closed.png` — Resting mouth

**Location:** `assets/sprites/`

### CoreS3 Sprites (M5Stack Display)

- **Dimensions:** 320×240 pixels (landscape)
- **Format:** PNG with alpha transparency (RGBA)
- **Color Profile:** sRGB
- **Files (standard):**
  - `cores3/idle.png` — Idle state
  - `cores3/blink.png` — Blink animation
  - `cores3/mouth_open.png` — Mouth open (talking)
  - `cores3/mouth_closed.png` — Mouth closed (resting)

**Location:** `assets/sprites/cores3/` (and `cores3-fixed/` variant)

**Optional Overlays:**
- `cores3/mouth_overlay_open.png` — Mouth open layer (for blending)
- `cores3/mouth_overlay_closed.png` — Mouth closed layer (for blending)

---

## Animation State Machine

```
┌─────────────────────────────────────────────────────┐
│                 STATE TRANSITIONS                    │
├─────────────────────────────────────────────────────┤
│  IDLE ←→ BLINK                                      │
│  IDLE  → THINKING (blink loop)                      │
│  IDLE  → TALKING (mouth loop)                       │
│  IDLE  → SUCCESS (blink → idle)                     │
│  IDLE  → ERROR (blink → idle)                       │
│  ANY   → IDLE (fallback)                            │
└─────────────────────────────────────────────────────┘
```

---

## Animation Timing Specifications

### 1. IDLE (Default State)

**Purpose:** Default state when waiting for input/event

| Property | Value | Notes |
|----------|-------|-------|
| Frames | [`idle.png`] | Single static frame |
| Frame Time | 500 ms | Minimal motion (slow) |
| Total Duration | 4000 ms (4 sec) | Repeats infinitely |
| Loop | Yes | Continuous |
| Trigger | Startup, after actions complete |
| Next State | N/A (loops) | Can transition to blink/thinking |

**Use Cases:**
- Startup animation
- Waiting for user input
- Processing complete (success)
- Return to default state

---

### 2. BLINK (Quick Eye Blink)

**Purpose:** Natural eye blink animation

| Property | Value | Notes |
|----------|-------|-------|
| Frames | [`idle.png`, `blink.png`, `idle.png`] | 3-frame sequence |
| Frame Time | 150 ms per frame | 450 ms total |
| Total Duration | 600 ms | One-shot animation |
| Loop | No | Single play-through |
| Trigger | Random during idle (~15-30 sec), or on-demand |
| Next State | `idle` | Always returns to idle |

**Use Cases:**
- Natural eye blinks (triggered randomly every 15-30 seconds)
- Success feedback (blink + smile)
- Acknowledgment gesture

**Frame Sequence Timing:**
```
0ms:    idle.png (eyes open)
150ms:  blink.png (eyes closed)
300ms:  idle.png (eyes open)
450ms:  → back to idle
```

---

### 3. TALKING (Mouth Animation Loop)

**Purpose:** Animate mouth while speaking

| Property | Value | Notes |
|----------|-------|-------|
| Frames | [`mouth_closed.png`, `mouth_open.png`] | 2-frame loop |
| Frame Time | 120 ms per frame | 240 ms cycle |
| Total Duration | Varies with speech | Runs until done |
| Loop | Yes | Continuous while active |
| Trigger | Speech synthesis starts, user input |
| Next State | `idle` | Returns when speech ends |

**Use Cases:**
- Playing audio response
- Voice synthesis animation
- Real-time speech feedback
- Active listening indicator

**Frame Sequence:**
```
0ms:    mouth_closed.png
120ms:  mouth_open.png
240ms:  mouth_closed.png (repeat)
```

**Duration Guide:**
- 3-second speech: ~12-13 cycles
- 10-second speech: ~40-42 cycles
- Adaptive timing based on actual audio playback

---

### 4. THINKING (Contemplative State)

**Purpose:** Show Rubi is processing/thinking

| Property | Value | Notes |
|----------|-------|-------|
| Frames | [`idle.png`, `blink.png`, `idle.png`] | 3-frame blink loop |
| Frame Time | 300 ms per frame | Slower blink (900 ms cycle) |
| Total Duration | 1200 ms per cycle | Repeats |
| Loop | Yes | Continuous |
| Trigger | Processing user input, AI inference |
| Next State | Next queued state (talking/success/idle) |

**Use Cases:**
- Processing user question
- Running AI model inference
- Generating response
- Loading/buffering indicator

**Visual Distinction:**
- Slower blink rate (300ms vs 150ms)
- Contemplative expression
- Brain emoji often shown alongside

---

### 5. SUCCESS (Completion Feedback)

**Purpose:** Positive completion indicator

| Property | Value | Notes |
|----------|-------|-------|
| Frames | [`idle.png`, `blink.png`] | 2-frame success |
| Frame Time | 150 ms per frame | Quick blink |
| Total Duration | 400 ms | One-shot |
| Loop | No | Single play-through |
| Trigger | Task complete, response sent |
| Next State | `idle` | Return to idle |

**Use Cases:**
- Task completed successfully
- Message sent confirmation
- Action confirmed
- Positive feedback

---

### 6. ERROR (Error Feedback)

**Purpose:** Indicate error occurred

| Property | Value | Notes |
|----------|-------|-------|
| Frames | [`idle.png`, `blink.png`, `idle.png`] | Distressed blink |
| Frame Time | 200 ms per frame | Moderate speed |
| Total Duration | 600 ms | One-shot |
| Loop | No | Single play-through |
| Trigger | Error occurred, connection lost |
| Next State | `idle` | Return to idle |

**Use Cases:**
- Error notification
- Connection failure
- Invalid input
- Negative feedback

---

## Frame Timing Constants

```javascript
// Frame timing in milliseconds
const FRAME_TIMINGS = {
  // Fast animations (user interaction feedback)
  FAST: 100,      // 100ms per frame (10 fps)
  NORMAL: 120,    // 120ms per frame (8.3 fps) ← RECOMMENDED
  SMOOTH: 150,    // 150ms per frame (6.7 fps)

  // Medium pacing
  MEDIUM: 200,    // 200ms per frame
  SLOW: 300,      // 300ms per frame (thinking)
  VERY_SLOW: 500, // 500ms per frame (idle)
};

// Complete animation sequence
const ANIMATION_CONFIG = {
  idle: {
    frameTime: 500,
    loop: true,
  },
  blink: {
    frameTime: 150,
    loop: false,
  },
  talking: {
    frameTime: 120,
    loop: true,
  },
  thinking: {
    frameTime: 300,
    loop: true,
  },
  success: {
    frameTime: 150,
    loop: false,
  },
  error: {
    frameTime: 200,
    loop: false,
  },
};
```

---

## CLI Terminal Display

### ASCII Art Fallback

When sprites cannot load or terminal doesn't support full graphics:

```
Idle State:
  ❤️  Rubi is here  ❤️
    (  o_o  )
     \__--__/

Blink State:
  ❤️  Rubi blinks  ❤️
    ( ^o^ )
     \__--__/

Thinking State:
  💭 Rubi thinking 💭
    ( o_o )
    \\\___\\/

Talking State:
  💬 Rubi talking  💬
    ( o▽o )
     \\__-_/

Success State:
  ✨ Success! ✨
    ( ^o^ )
     \__--__/

Error State:
  ❌ Error ❌
    ( x_x )
     \__--__/
```

---

## Platform-Specific Rendering

### Pi 5 Handheld (320×480 Display)

- **Native Size:** Full 320×480 sprites
- **Target FPS:** 30 fps (30ms frame time)
- **Frame Rate Limiting:** Lock to 30 FPS to reduce CPU usage
- **Sprite Caching:** In-memory cache (max 10MB)
- **Rendering:** HTML5 Canvas (2D context)
- **GPU Acceleration:** Optional (check WebGL availability)

**Recommended Animation Timings:**
- Idle: 500ms per frame (looks static, good for Pi resources)
- Blink: 150ms per frame (smooth, natural feel)
- Talking: 120ms per frame (sync with speech)
- Thinking: 300ms per frame (slow, contemplative)

### CoreS3 (320×240 Display)

- **Native Size:** Full 320×240 sprites (scaled from 480)
- **Target FPS:** 25 fps (40ms frame time)
- **Frame Rate Limiting:** Strict 25 FPS for embedded system
- **Sprite Caching:** Aggressive caching (minimal memory)
- **Rendering:** M5Stack native Lcd library OR Canvas fallback
- **Touch Input:** Capacitive buttons + swipe gestures

**Recommended Animation Timings:**
- Idle: 500ms per frame (static appearance)
- Blink: 150ms per frame (natural blink)
- Talking: 120ms per frame (mouth sync)
- Thinking: 300ms per frame (slower contemplation)

### CLI Terminal

- **No Sprites:** ASCII art fallback
- **Update Rate:** ~100-200ms for smooth spinner
- **Colors:** ANSI 256-color support (fallback to 16)
- **Animation:** Spinner + emoji + colored text

---

## State Transition Flow

```
┌──────────────────────────────────────────────────────────┐
│ APPLICATION LIFECYCLE WITH ANIMATION STATES              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Startup                                                 │
│   ├─ IDLE (startup animation)                           │
│   └─ Ready for input                                    │
│                                                          │
│ User Input Received                                     │
│   ├─ THINKING (processing indicator)                    │
│   ├─ [AI processing...]                                 │
│   └─ Ready to respond                                   │
│                                                          │
│ Generating Response                                     │
│   ├─ TALKING (mouth sync with speech)                   │
│   ├─ [Playing audio...]                                 │
│   └─ Response complete                                  │
│                                                          │
│ Completion                                              │
│   ├─ SUCCESS (positive feedback)                        │
│   ├─ BLINK (natural eye blink)                          │
│   └─ IDLE (return to waiting)                           │
│                                                          │
│ Error Path                                              │
│   ├─ ERROR (error indicator)                            │
│   ├─ BLINK (acknowledgment)                             │
│   └─ IDLE (ready for retry)                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Performance Guidelines

### CPU Usage by Animation

| Animation | CPU Impact | Notes |
|-----------|-----------|-------|
| IDLE | Very Low | Static frame, minimal redraws |
| BLINK | Low | 3 frames, short duration |
| TALKING | Medium | Continuous mouth loop |
| THINKING | Medium | Continuous blink loop |
| SUCCESS | Low | 2 frames, brief |
| ERROR | Low | 3 frames, brief |

### Memory Usage

- **Per Sprite:** ~380 KB (320×480 RGBA PNG)
- **CoreS3 Sprite:** ~310 KB (320×240 RGBA PNG)
- **Typical Cache:** 4 sprites = 1.5 MB
- **Browser Cache:** LRU eviction at 10 MB threshold

### Recommended Frame Times by Device

| Device | Target FPS | Frame Time |
|--------|-----------|-----------|
| Desktop (modern) | 60 | 16.7 ms |
| Laptop | 30 | 33 ms |
| Pi 5 | 30 | 33 ms |
| CoreS3 | 25 | 40 ms |
| CLI Terminal | 10 | 100 ms |

---

## Testing & Validation

### Animation Quality Checklist

- [ ] Sprites load without artifacts
- [ ] Frame transitions are smooth
- [ ] Mouth sync aligns with speech timing
- [ ] Blink looks natural and regular
- [ ] Thinking state is visually distinct
- [ ] Success/error feedback is clear
- [ ] Animations loop smoothly (no jumping)
- [ ] CPU/memory usage acceptable on target device

### Device-Specific Tests

**Pi 5:**
- [ ] 30 FPS maintained during all animations
- [ ] No memory leaks after 10+ minutes
- [ ] Touch input responsive (if applicable)

**CoreS3:**
- [ ] 25 FPS stable on embedded system
- [ ] Display doesn't overheat
- [ ] Status bar updates readable

**CLI:**
- [ ] ASCII art displays correctly in terminal
- [ ] Colors work in 16-color terminals
- [ ] Spinner animation smooth at 10 FPS

---

## Future Enhancements (Phase 4+)

- [ ] Eye tracking (gaze direction)
- [ ] Emotion-based expressions (happy, sad, confused)
- [ ] Talking head lip-sync (speech recognition)
- [ ] Full-body animations (gestures, dances)
- [ ] Particle effects (neon glow, sparkles)
- [ ] Custom sprite packs (user-created avatars)
- [ ] Hardware acceleration (WebGL/Metal)
- [ ] VR/AR avatar support

---

## Integration Examples

See `PHASE-3-INTEGRATION.md` for complete code examples and integration patterns.

---

_Last updated: March 2026 | Phase 3 Complete_
