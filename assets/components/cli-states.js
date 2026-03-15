/**
 * JSEBot CLI States & Animations
 * 
 * Terminal-friendly spinners, loading states, and animations for JSEBot CLI.
 * Works with the `ora` library or can be used standalone.
 * 
 * @module cli-states
 * @version 1.0.0
 */

// ============================================================================
// SPINNER FRAMES & DEFINITIONS
// ============================================================================

const spinners = {
  /**
   * 4-frame quarter circle spinner
   * Clean and minimal
   */
  quarterCircle: {
    interval: 80,
    frames: ['◐', '◓', '◑', '◒']
  },

  /**
   * 8-frame Braille spinner
   * Good for longer operations, doesn't feel repetitive
   */
  braille: {
    interval: 80,
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧']
  },

  /**
   * 12-frame dots spinner
   * Linear progression
   */
  dots: {
    interval: 80,
    frames: ['⠋', '⠙', '⠚', '⠞', '⠖', '⠦', '⠴', '⠲', '⠳', '⠓']
  },

  /**
   * Simple line spinner
   * Classic alternating pattern
   */
  line: {
    interval: 130,
    frames: ['−', '\\', '|', '/']
  },

  /**
   * Arrow spinner
   * Directional feel
   */
  arrow: {
    interval: 100,
    frames: ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙']
  },

  /**
   * Pulsing robot emoji
   * Friendly and visual
   */
  robot: {
    interval: 200,
    frames: ['🤖', '🤖', '🤖', '🤖']
  },

  /**
   * Hourglass spinner
   * Time-based feel
   */
  hourglass: {
    interval: 100,
    frames: ['⌛', '⏳']
  }
};

// ============================================================================
// ASCII ART MESSAGES
// ============================================================================

const messages = {
  /**
   * Success message box
   */
  success: () => `
  ┌─────────────────────────────────────┐
  │ ✓ Success!                          │
  │                                     │
  │ Operation completed successfully.   │
  └─────────────────────────────────────┘
`,

  /**
   * Error message box
   */
  error: () => `
  ┌─────────────────────────────────────┐
  │ ✗ Error                             │
  │                                     │
  │ Something went wrong.               │
  │ Check logs for details.             │
  └─────────────────────────────────────┘
`,

  /**
   * Welcome banner
   */
  welcome: (version = 'v0.1.1') => `
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║          Welcome to JSEBot ${version.padEnd(28)}║
  ║                                                           ║
  ║    Your AI-Powered CLI Assistant                         ║
  ║                                                           ║
  ║    🤖  AI Assistant      🔌  Multi-Channel              ║
  ║    🛠️  Extensible        ⚡  Lightning Fast             ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
`,

  /**
   * Minimal welcome banner
   */
  minimalWelcome: (version = 'v0.1.1') => `
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃   🤖 JSEBot ${version.padEnd(34)}┃
  ┃   Your AI-Powered CLI Assistant           ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`,

  /**
   * Info message
   */
  info: (title, message) => `
  ℹ️  ${title}
  
  ${message}
`,

  /**
   * Robot with checkmark
   */
  robotSuccess: () => `
  ┌─────────────────────┐
  │ 🤖  ✓               │
  │                     │
  │ Success!            │
  └─────────────────────┘
`,

  /**
   * Robot with error
   */
  robotError: () => `
  ┌─────────────────────┐
  │ 🤖  ✗               │
  │                     │
  │ Error!              │
  └─────────────────────┘
`
};

// ============================================================================
// ANIMATION HELPERS
// ============================================================================

/**
 * Create a progress bar for terminal display
 * @param {number} current - Current progress (0-100)
 * @param {number} width - Width of the bar in characters (default: 20)
 * @returns {string} Formatted progress bar
 */
function progressBar(current, width = 20) {
  const filled = Math.round((current / 100) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percent = current.toString().padStart(3);
  return `[${bar}] ${percent}%`;
}

/**
 * Create an indeterminate loading bar with animation frame
 * @param {number} frame - Current frame (0-width)
 * @param {number} width - Width of the bar (default: 20)
 * @returns {string} Animated loading bar
 */
function loadingBar(frame, width = 20) {
  const position = frame % (width + 1);
  const bar = ' '.repeat(position) + '●' + ' '.repeat(width - position);
  return `[${bar}]`;
}

/**
 * Create an animated thinking indicator
 * @param {number} frame - Current frame number
 * @returns {string} Thinking indicator with dots
 */
function thinkingDots(frame) {
  const dots = '.'.repeat((frame % 4) + 1);
  return `Thinking${dots}`.padEnd(13);
}

/**
 * Colorize text for terminal output
 * @param {string} text - Text to colorize
 * @param {string} color - Color name (cyan, green, red, yellow, blue, white)
 * @returns {string} Colorized text with ANSI codes
 */
function colorize(text, color = 'cyan') {
  const colors = {
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
  };

  const startCode = colors[color] || colors.cyan;
  return `${startCode}${text}${colors.reset}`;
}

/**
 * Clear ANSI color codes from text
 * @param {string} text - Text with ANSI codes
 * @returns {string} Plain text
 */
function stripColor(text) {
  return text.replace(/\x1b\[\d+m/g, '');
}

// ============================================================================
// INTEGRATION WITH ORA LIBRARY
// ============================================================================

/**
 * Create a spinner with JSEBot styling
 * Requires: npm install ora
 * 
 * @param {string} text - Spinner text
 * @param {string} spinnerType - Type of spinner (quarterCircle, braille, dots, etc.)
 * @returns {object} Configured ora spinner
 * 
 * @example
 * const { createSpinner } = require('./cli-states');
 * const spinner = createSpinner('Loading...', 'braille');
 * spinner.start();
 * // ... do work ...
 * spinner.succeed('Complete!');
 */
function createSpinner(text, spinnerType = 'braille') {
  try {
    const ora = require('ora');
    const spinner = spinners[spinnerType] || spinners.braille;

    return ora({
      text,
      spinner,
      color: 'cyan'
    });
  } catch (error) {
    console.warn('WARNING: ora library not found. Install with: npm install ora');
    // Fallback: simple console logging
    return {
      start: () => console.log(`⏳ ${text}`),
      succeed: (msg) => console.log(`✓ ${msg}`),
      fail: (msg) => console.log(`✗ ${msg}`),
      warn: (msg) => console.log(`⚠ ${msg}`),
      stop: () => {},
      clear: () => {},
      text: text
    };
  }
}

/**
 * Show welcome banner and initialize
 * @param {object} options - Configuration options
 * @param {string} options.version - Version number
 * @param {boolean} options.minimal - Use minimal banner (default: false)
 */
function showWelcome(options = {}) {
  const { version = 'v0.1.1', minimal = false } = options;
  const banner = minimal
    ? messages.minimalWelcome(version)
    : messages.welcome(version);
  console.log(banner);
}

/**
 * Show success state with animation
 * @param {string} message - Success message
 * @param {object} options - Display options
 */
function showSuccess(message = 'Complete!', options = {}) {
  const { useRobot = false } = options;
  console.log(useRobot ? messages.robotSuccess() : messages.success());
  if (message !== 'Complete!') {
    console.log(`  ${colorize(message, 'green')}`);
  }
}

/**
 * Show error state with animation
 * @param {string} message - Error message
 * @param {object} options - Display options
 */
function showError(message = 'Operation failed', options = {}) {
  const { useRobot = false } = options;
  console.log(useRobot ? messages.robotError() : messages.error());
  if (message !== 'Operation failed') {
    console.log(`  ${colorize(message, 'red')}`);
  }
}

/**
 * Show info message
 * @param {string} title - Info title
 * @param {string} message - Info message
 */
function showInfo(title, message) {
  console.log(messages.info(title, message));
}

// ============================================================================
// ADVANCED PATTERNS
// ============================================================================

/**
 * Run a multi-step workflow with spinners
 * Useful for onboarding, setup, or complex initialization
 * 
 * @param {array} steps - Array of step objects
 * @param {string} steps[].name - Step name (displayed)
 * @param {function} steps[].fn - Async function to run
 * @param {string} steps[].successMsg - Success message
 * 
 * @example
 * const steps = [
 *   {
 *     name: 'Initializing',
 *     fn: async () => { await init(); },
 *     successMsg: 'Initialized'
 *   },
 *   {
 *     name: 'Connecting channels',
 *     fn: async () => { await connectChannels(); },
 *     successMsg: 'Channels connected'
 *   }
 * ];
 * await runWorkflow(steps);
 */
async function runWorkflow(steps) {
  for (const step of steps) {
    const spinner = createSpinner(step.name, 'braille');
    spinner.start();

    try {
      await step.fn();
      spinner.succeed(step.successMsg || step.name);
    } catch (error) {
      spinner.fail(`${step.name} failed: ${error.message}`);
      throw error;
    }
  }

  console.log('');
  showSuccess('All steps completed!');
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Spinner definitions
  spinners,
  messages,

  // Helper functions
  progressBar,
  loadingBar,
  thinkingDots,
  colorize,
  stripColor,

  // Spinner creation & display
  createSpinner,
  showWelcome,
  showSuccess,
  showError,
  showInfo,

  // Advanced patterns
  runWorkflow,

  // Version info
  version: '1.0.0',
  description: 'JSEBot CLI States & Animations'
};
