# JSEBot CLI States & ASCII Art

Visual states and animations for the JSEBot CLI interface. These are text-based representations for terminal output with code examples for implementation.

---

## 1. Loading/Thinking States

### Spinner Frames (4-frame animation)

```
Frame 1: ◐ Loading...
Frame 2: ◓ Loading...
Frame 3: ◑ Loading...
Frame 4: ◒ Loading...
```

### Alternative: Pulsing Robot

```
Frame 1:
  ┌─────────┐
  │ 🤖      │
  └─────────┘

Frame 2:
  ┌─────────┐
  │  🤖     │
  └─────────┘

Frame 3:
  ┌─────────┐
  │   🤖    │
  └─────────┘

Frame 4:
  ┌─────────┐
  │  🤖     │
  └─────────┘
```

### Advanced: Thinking Spinner

```
Frame 1: ⠋ Thinking...
Frame 2: ⠙ Thinking...
Frame 3: ⠹ Thinking...
Frame 4: ⠸ Thinking...
Frame 5: ⠼ Thinking...
Frame 6: ⠴ Thinking...
Frame 7: ⠦ Thinking...
Frame 8: ⠧ Thinking...
```

---

## 2. Success State

### Checkmark Art

```
    ✓
   ╱
  ╱
```

### Full Success Message

```
  ┌─────────────────────────────┐
  │ ✓ Success!                  │
  │                             │
  │ Operation completed.        │
  └─────────────────────────────┘
```

### Robot with Checkmark

```
  ┌─────────┐
  │ 🤖  ✓   │
  │         │
  │ Success!│
  └─────────┘
```

---

## 3. Error State

### X Mark Art

```
    ✗
   ╱ ╲
  ╱   ╲
```

### Full Error Message

```
  ┌─────────────────────────────┐
  │ ✗ Error                     │
  │                             │
  │ Something went wrong.       │
  │ Check logs for details.     │
  └─────────────────────────────┘
```

### Robot with Error

```
  ┌─────────┐
  │ 🤖  ✗   │
  │         │
  │ Error!  │
  └─────────┘
```

---

## 4. Welcome Banner

### ASCII Banner

```
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║          Welcome to JSEBot v0.1.1                         ║
  ║                                                           ║
  ║    Your AI-Powered CLI Assistant                         ║
  ║                                                           ║
  ║    🤖  AI Assistant      🔌  Multi-Channel              ║
  ║    🛠️  Extensible        ⚡  Lightning Fast             ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
```

### Minimal Banner

```
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃   🤖 JSEBot v0.1.1               ┃
  ┃   Your AI-Powered CLI Assistant  ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 5. Info State

### Info Box

```
  ℹ️  Information
  
  This is a helpful message.
  More details can go here.
```

---

## Implementation Examples

### Using `ora` (Popular Spinner Library)

```javascript
const ora = require('ora');

// Basic spinner
const spinner = ora('Loading...').start();

setTimeout(() => {
  spinner.succeed('Task completed!');
}, 2000);
```

### Custom Spinner Frames with `ora`

```javascript
const ora = require('ora');

const frames = ['◐', '◓', '◑', '◒'];
const spinner = ora({
  text: 'Thinking...',
  spinner: { interval: 80, frames }
}).start();

setTimeout(() => {
  spinner.succeed('Done thinking!');
}, 3000);
```

### Braille Spinner with `ora`

```javascript
const ora = require('ora');

const brailleFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧'];
const spinner = ora({
  text: 'Thinking...',
  spinner: { interval: 80, frames: brailleFrames }
}).start();

setTimeout(() => {
  spinner.succeed('Process complete!');
}, 3000);
```

### Success with Custom Symbol

```javascript
const ora = require('ora');

const spinner = ora('Processing...').start();

setTimeout(() => {
  spinner.succeed('✓ Operation successful');
  // Alternative colored output
  console.log('\n  ┌─────────────────────┐');
  console.log('  │ ✓ Success!          │');
  console.log('  └─────────────────────┘\n');
}, 2000);
```

### Error State

```javascript
const ora = require('ora');

const spinner = ora('Running task...').start();

setTimeout(() => {
  spinner.fail('✗ Task failed');
  console.log('\n  Please check logs for details.\n');
}, 1500);
```

### Combined Workflow (Welcome → Thinking → Success)

```javascript
const ora = require('ora');

async function runJSEBot() {
  // Welcome banner
  console.log(`
  ╔═════════════════════════════════════╗
  ║   🤖 JSEBot v0.1.1                  ║
  ║   AI-Powered CLI Assistant          ║
  ╚═════════════════════════════════════╝
  `);

  // Spinner for thinking
  const spinner = ora({
    text: 'Initializing...',
    spinner: { 
      interval: 80, 
      frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧']
    }
  }).start();

  // Simulate work
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  spinner.text = 'Connecting to channels...';
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  spinner.succeed('✓ Ready to assist!');
  console.log('Type "help" for available commands.\n');
}

runJSEBot();
```

### With Progress Indicator

```javascript
const ora = require('ora');

async function longOperation() {
  const tasks = ['Fetching data', 'Processing', 'Finalizing'];
  
  for (const task of tasks) {
    const spinner = ora(`${task}...`).start();
    await new Promise(resolve => setTimeout(resolve, 1000));
    spinner.succeed(task);
  }
  
  console.log('\n✓ All tasks completed!\n');
}

longOperation();
```

---

## Recommended Implementations

### For Startup Splash
- Display the ASCII banner at startup
- Use braille spinner for initialization
- Transition to "Ready to assist" message

### For Interactive Commands
- Use 4-frame spinner for quick operations (<1s)
- Use braille spinner for longer operations (>1s)
- Always provide clear success/error messages

### For Onboarding
- Show welcome banner with features
- Use success symbols for completed steps
- Provide helpful info boxes with next steps

### Color Scheme (Optional)
- **Success**: Green (#10b981) with ✓
- **Error**: Red (#ef4444) with ✗
- **Info**: Blue (#0ea5e9) with ℹ️
- **Loading**: Cyan (#06b6d4) with spinner

---

## Notes for Future Phases

- **Phase 3**: Animated ASCII art frames using timing libraries
- **Phase 4**: Full TUI (Terminal User Interface) with interactive elements
- **Phase 5**: Multi-platform rendering (Windows ConPTY, ANSI, etc.)

---

_Last Updated: March 2026_
_JSEBot Branding Phase 2_