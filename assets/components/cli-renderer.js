/**
 * CLI Renderer for Rubi Sprite Animation
 * Phase 3: Terminal Display Integration
 *
 * Displays animated Rubi avatar in the terminal with ASCII fallback
 * Supports: startup, loading, input, thinking, processing, completion states
 */

class CLIRenderer {
  constructor(options = {}) {
    this.width = options.width || process.stdout.columns || 80;
    this.height = options.height || 24;
    this.useASCII = options.useASCII || !this._supportsAnimation();
    this.useColor = options.useColor !== false;
    this.engine = null;
    this.isRunning = false;

    // ASCII representations (Unicode fallback)
    this.ascii = {
      idle: [
        '  ❤️  Rubi is here  ❤️  ',
        '    (  o_o  )',
        '     \\__--__/',
      ],
      blink: [
        '  ❤️  Rubi blinks  ❤️  ',
        '    ( ^o^ )',
        '     \\__--__/',
      ],
      thinking: [
        '  💭 Rubi thinking 💭  ',
        '    ( o_o )',
        '    \\\\___\\\\/',
      ],
      talking: [
        '  💬 Rubi talking  💬  ',
        '    ( o▽o )',
        '     \\\\__-_/',
      ],
      loading: [
        '  ⏳ Loading... ⏳  ',
        '    ( o.o )',
        '     \\\\__--__/',
      ],
      success: [
        '  ✨ Success! ✨  ',
        '    ( ^o^ )',
        '     \\\\__--__/',
      ],
      error: [
        '  ❌ Error ❌  ',
        '    ( x_x )',
        '     \\\\__--__/',
      ],
    };

    // Spinner variants
    this.spinners = {
      minimal: ['◐', '◓', '◑', '◒'],
      braille: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
      dots: ['⠋', '⠙', '⠚', '⠞', '⠖', '⠦', '⠴', '⠲', '⠳', '⠓'],
      line: ['−', '\\', '|', '/'],
      arrow: ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'],
      robot: ['🤖'],
      hourglass: ['⌛', '⏳'],
    };

    this.currentSpinner = 'braille';
    this.spinnerFrame = 0;
  }

  /**
   * Check if terminal supports animation
   * @private
   * @returns {boolean}
   */
  _supportsAnimation() {
    if (typeof process === 'undefined') return false;
    if (typeof process.env === 'undefined') return false;

    const term = process.env.TERM || '';
    const dumbTerms = ['dumb', 'emacs', 'basic'];

    if (dumbTerms.includes(term)) return false;
    if (!process.stdout.isTTY) return false;

    return true;
  }

  /**
   * Get current spinner frame
   * @returns {string}
   */
  getSpinnerFrame() {
    const frames = this.spinners[this.currentSpinner];
    const frame = frames[this.spinnerFrame % frames.length];
    this.spinnerFrame++;
    return frame;
  }

  /**
   * Format text with color (ANSI)
   * @param {string} text
   * @param {string} color - 'cyan', 'green', 'red', 'yellow', 'magenta'
   * @returns {string}
   */
  colorize(text, color = 'cyan') {
    if (!this.useColor) return text;

    const colors = {
      reset: '\x1b[0m',
      cyan: '\x1b[36m',
      green: '\x1b[32m',
      red: '\x1b[31m',
      yellow: '\x1b[33m',
      magenta: '\x1b[35m',
      bright: '\x1b[1m',
      dim: '\x1b[2m',
    };

    return `${colors[color] || ''}${text}${colors.reset}`;
  }

  /**
   * Clear line (ANSI)
   * @returns {string}
   */
  clearLine() {
    return '\x1b[2K\x1b[1G';
  }

  /**
   * Move cursor (ANSI)
   * @param {number} x - Column
   * @param {number} y - Row
   * @returns {string}
   */
  moveCursor(x, y) {
    return `\x1b[${y};${x}H`;
  }

  /**
   * Show startup screen
   */
  showStartup() {
    console.clear?.();
    this._drawBox('🤖 JSEBot Startup 🤖');
    this._drawAsciiAvatar('idle');
    console.log(
      this.colorize('\n  Initializing AI assistant...', 'cyan')
    );
    console.log(this.colorize('  Loading Rubi personality...', 'magenta'));
    console.log(this.colorize('  Connecting to services...\n', 'cyan'));
  }

  /**
   * Show loading state with spinner
   * @param {string} message
   */
  showLoading(message = 'Loading...') {
    const spinner = this.getSpinnerFrame();
    const spacer = ' '.repeat(Math.max(0, this.width - message.length - 3));
    process.stdout.write(
      `\r${spinner} ${message}${spacer}`
    );
  }

  /**
   * Show input prompt with Rubi waiting
   */
  showPrompt() {
    this._drawBox('💬 Waiting for Input 💬');
    this._drawAsciiAvatar('idle');
    console.log(this.colorize('\n  > ', 'green'));
  }

  /**
   * Show thinking/processing state
   */
  showThinking() {
    const spinner = this.getSpinnerFrame();
    this._drawBox('🧠 Rubi is Thinking 🧠');
    this._drawAsciiAvatar('thinking');
    console.log(
      this.colorize(
        `\n  ${spinner} Processing your request...`,
        'magenta'
      )
    );
  }

  /**
   * Show success state
   * @param {string} message
   */
  showSuccess(message = 'Task Complete!') {
    this._drawBox('✨ Success! ✨');
    this._drawAsciiAvatar('success');
    console.log(this.colorize(`\n  ${message}\n`, 'green'));
  }

  /**
   * Show error state
   * @param {string} message
   */
  showError(message = 'An error occurred') {
    this._drawBox('❌ Error ❌');
    this._drawAsciiAvatar('error');
    console.log(this.colorize(`\n  ${message}\n`, 'red'));
  }

  /**
   * Draw ASCII Rubi avatar
   * @private
   * @param {string} state
   */
  _drawAsciiAvatar(state) {
    const art = this.ascii[state] || this.ascii.idle;
    art.forEach((line) => {
      console.log(
        this.colorize(`  ${line}`, 'magenta')
      );
    });
  }

  /**
   * Draw decorative box
   * @private
   * @param {string} title
   */
  _drawBox(title) {
    const width = 50;
    const paddedTitle = ` ${title} `.padEnd(width - 2, ' ');
    console.log(this.colorize('╔' + '═'.repeat(width - 2) + '╗', 'cyan'));
    console.log(
      this.colorize(`║${paddedTitle}║`, 'cyan')
    );
    console.log(this.colorize('╚' + '═'.repeat(width - 2) + '╝', 'cyan'));
  }

  /**
   * Show progress bar
   * @param {number} current
   * @param {number} total
   * @param {string} label
   */
  showProgress(current, total, label = 'Progress') {
    const width = 30;
    const percentage = Math.min(100, Math.round((current / total) * 100));
    const filled = Math.round((width * percentage) / 100);
    const empty = width - filled;

    const bar =
      '[' +
      '█'.repeat(filled) +
      '░'.repeat(empty) +
      ']';

    const text = `${label}: ${bar} ${percentage}%`;
    process.stdout.write(`\r${this.colorize(text, 'cyan')}`);

    if (percentage === 100) {
      console.log();
    }
  }

  /**
   * Clear terminal output
   */
  clearOutput() {
    console.clear?.();
  }

  /**
   * Print styled message
   * @param {string} message
   * @param {string} type - 'info', 'success', 'warning', 'error'
   */
  printMessage(message, type = 'info') {
    const colors = {
      info: 'cyan',
      success: 'green',
      warning: 'yellow',
      error: 'red',
    };

    const symbols = {
      info: 'ℹ️',
      success: '✓',
      warning: '⚠️',
      error: '✗',
    };

    const color = colors[type] || 'cyan';
    const symbol = symbols[type] || '•';

    console.log(
      this.colorize(`  ${symbol} ${message}`, color)
    );
  }

  /**
   * Show workflow step indicator
   * @param {number} step
   * @param {number} total
   * @param {string} description
   */
  showStep(step, total, description) {
    const progress = `[${step}/${total}]`;
    const text = `${progress} ${description}`;
    console.log(this.colorize(text, 'cyan'));
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CLIRenderer;
}
