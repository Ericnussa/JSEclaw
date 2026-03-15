/**
 * M5Stack CoreS3 Dashboard
 * Phase 3: Smart Display Integration (320x240)
 *
 * Optimized dashboard for M5Stack CoreS3 with 320x240 display
 * Shows Rubi avatar (scaled 320x240), system status, and controls
 * Uses M5.h/Arduino C++ or web-based fallback
 */

class CoreS3Dashboard {
  constructor(options = {}) {
    this.width = options.width || 320;
    this.height = options.height || 240;
    this.spritePath = options.spritePath || './assets/sprites/cores3/';
    this.updateInterval = options.updateInterval || 1000; // ms
    this.theme = options.theme || 'dark'; // dark | light

    // Canvas/display context
    this.canvas = null;
    this.ctx = null;
    this.isInitialized = false;

    // Sprite cache (aggressive caching for embedded system)
    this.sprites = {};
    this.cachedMetrics = {};

    // Animation state
    this.currentState = 'idle';
    this.animationFrame = 0;
    this.isAnimating = false;
    this.lastUpdateTime = 0;

    // System metrics
    this.metrics = {
      cpu: 0,
      memory: 0,
      network: 'unknown',
      modelRunning: 'none',
      temperature: 0,
    };

    // Theme colors
    this.colors = {
      dark: {
        background: '#0a0e27',
        text: '#e0e0e0',
        accent: '#00d4ff', // Neon cyan
        success: '#00ff00',
        warning: '#ffaa00',
        error: '#ff0055',
        border: '#1a3a4a',
      },
      light: {
        background: '#f5f5f5',
        text: '#0a0e27',
        accent: '#0084d4',
        success: '#00aa00',
        warning: '#ff8800',
        error: '#cc0033',
        border: '#cccccc',
      },
    };

    this.palette = this.colors[this.theme];
  }

  /**
   * Initialize CoreS3 display
   * @returns {boolean} Success status
   */
  initialize() {
    try {
      if (typeof document === 'undefined') {
        console.log('CoreS3Dashboard: Web DOM not available');
        return this._initializeNative();
      }

      const canvasElement = document.getElementById('coresia-canvas');
      if (canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d', {
          alpha: false,
          antialias: false,
        });

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.isInitialized = true;
        return true;
      }

      return false;
    } catch (error) {
      console.error('CoreS3 initialization error:', error);
      return false;
    }
  }

  /**
   * Initialize native M5Stack display (Arduino C++)
   * @private
   * @returns {boolean}
   */
  _initializeNative() {
    // Check for M5Stack APIs
    if (
      typeof M5 !== 'undefined' &&
      M5.Lcd &&
      typeof M5.Lcd.drawRect === 'function'
    ) {
      console.log('M5Stack CoreS3 native display detected');
      return true;
    }
    return false;
  }

  /**
   * Load sprite for CoreS3 size
   * @param {string} spriteName
   * @returns {Promise<Image>}
   */
  loadSprite(spriteName) {
    return new Promise((resolve, reject) => {
      if (this.sprites[spriteName]) {
        resolve(this.sprites[spriteName]);
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.sprites[spriteName] = img;
        resolve(img);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load sprite: ${spriteName}`));
      };

      img.src = `${this.spritePath}${spriteName}`;
    });
  }

  /**
   * Update system metrics
   * @param {Object} newMetrics
   */
  updateMetrics(newMetrics) {
    Object.assign(this.metrics, newMetrics);
  }

  /**
   * Render dashboard frame
   */
  render() {
    if (!this.isInitialized) return;

    // Clear screen
    this._clearScreen();

    // Draw layout zones
    this._drawAvatarZone();
    this._drawStatusBar();
    this._drawButtons();

    // Schedule next frame
    requestAnimationFrame(() => this.render());
  }

  /**
   * Clear screen
   * @private
   */
  _clearScreen() {
    if (this.ctx) {
      this.ctx.fillStyle = this.palette.background;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  /**
   * Draw avatar zone (top 180px)
   * @private
   */
  _drawAvatarZone() {
    const zoneHeight = 180;

    // Background
    this.ctx.fillStyle = this.palette.background;
    this.ctx.fillRect(0, 0, this.width, zoneHeight);

    // Border
    this.ctx.strokeStyle = this.palette.accent;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(1, 1, this.width - 2, zoneHeight - 2);

    // Draw sprite (320x240 sprite scaled to fit)
    const sprite = this.sprites[this.currentState];
    if (sprite) {
      // Sprite is 320x240, fits perfectly top-center
      this.ctx.drawImage(sprite, 0, 0, this.width, zoneHeight);
    } else {
      // Placeholder: ASCII art
      this._drawAvatarPlaceholder(zoneHeight);
    }
  }

  /**
   * Draw avatar placeholder (ASCII fallback)
   * @private
   * @param {number} zoneHeight
   */
  _drawAvatarPlaceholder(zoneHeight) {
    this.ctx.fillStyle = this.palette.accent;
    this.ctx.font = '12px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      '🤖',
      this.width / 2,
      zoneHeight / 2 - 10
    );
    this.ctx.font = '10px monospace';
    this.ctx.fillText(
      'Loading Rubi...',
      this.width / 2,
      zoneHeight / 2 + 10
    );
  }

  /**
   * Draw status bar (bottom 60px)
   * @private
   */
  _drawStatusBar() {
    const barY = 180;
    const barHeight = this.height - barY;

    // Background with gradient effect
    this.ctx.fillStyle = '#0a0e27';
    this.ctx.globalAlpha = 0.95;
    this.ctx.fillRect(0, barY, this.width, barHeight);
    this.ctx.globalAlpha = 1.0;

    // Border
    this.ctx.strokeStyle = this.palette.accent;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(1, barY, this.width - 2, barHeight - 1);

    // Status indicators
    const labelX = 5;
    const valueX = 85;
    const row1Y = barY + 12;
    const row2Y = barY + 25;
    const row3Y = barY + 38;

    this.ctx.fillStyle = this.palette.text;
    this.ctx.font = '9px monospace';
    this.ctx.textAlign = 'left';

    // CPU %
    this.ctx.fillStyle = this.palette.text;
    this.ctx.fillText('CPU:', labelX, row1Y);
    this.ctx.fillStyle = this._getMetricColor(this.metrics.cpu);
    this.ctx.fillText(
      `${this.metrics.cpu}%`,
      valueX,
      row1Y
    );

    // Memory %
    this.ctx.fillStyle = this.palette.text;
    this.ctx.fillText('MEM:', labelX, row2Y);
    this.ctx.fillStyle = this._getMetricColor(this.metrics.memory);
    this.ctx.fillText(
      `${this.metrics.memory}%`,
      valueX,
      row2Y
    );

    // Network status
    this.ctx.fillStyle = this.palette.text;
    this.ctx.fillText('NET:', labelX, row3Y);
    this.ctx.fillStyle = this._getNetworkColor(
      this.metrics.network
    );
    this.ctx.fillText(
      this.metrics.network.toUpperCase(),
      valueX,
      row3Y
    );

    // Model indicator (right side)
    this.ctx.fillStyle = this.palette.text;
    this.ctx.textAlign = 'right';
    this.ctx.fillText(
      `Model: ${this.metrics.modelRunning}`,
      this.width - 5,
      row1Y
    );
  }

  /**
   * Draw control buttons
   * @private
   */
  _drawButtons() {
    const buttonY = 220;
    const buttonWidth = 155;
    const buttonHeight = 18;

    // Settings button (left)
    this._drawButton(
      2,
      buttonY,
      buttonWidth,
      buttonHeight,
      '⚙ Settings'
    );

    // Refresh button (right)
    this._drawButton(
      this.width - buttonWidth - 2,
      buttonY,
      buttonWidth,
      buttonHeight,
      '🔄 Refresh'
    );
  }

  /**
   * Draw single button
   * @private
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string} label
   */
  _drawButton(x, y, width, height, label) {
    // Button background
    this.ctx.fillStyle = '#1a2351';
    this.ctx.fillRect(x, y, width, height);

    // Button border
    this.ctx.strokeStyle = this.palette.accent;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, width, height);

    // Button text
    this.ctx.fillStyle = this.palette.accent;
    this.ctx.font = 'bold 9px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(label, x + width / 2, y + height / 2);
  }

  /**
   * Get color based on metric value
   * @private
   * @param {number} value 0-100
   * @returns {string} Color hex
   */
  _getMetricColor(value) {
    if (value < 50) return this.palette.success;
    if (value < 75) return this.palette.warning;
    return this.palette.error;
  }

  /**
   * Get color based on network status
   * @private
   * @param {string} status
   * @returns {string} Color hex
   */
  _getNetworkColor(status) {
    switch (status?.toLowerCase()) {
      case 'online':
        return this.palette.success;
      case 'offline':
        return this.palette.error;
      case 'connecting':
        return this.palette.warning;
      default:
        return this.palette.text;
    }
  }

  /**
   * Set animation state
   * @param {string} state
   */
  setState(state) {
    this.currentState = state;
    this.animationFrame = 0;
  }

  /**
   * Show system info popup (temporary overlay)
   * @param {string} title
   * @param {Object} info
   */
  showInfo(title, info) {
    // Draw semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw info box
    const boxWidth = this.width - 20;
    const boxHeight = this.height - 40;
    const boxX = 10;
    const boxY = 20;

    this.ctx.fillStyle = this.palette.background;
    this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    this.ctx.strokeStyle = this.palette.accent;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Title
    this.ctx.fillStyle = this.palette.accent;
    this.ctx.font = 'bold 12px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(title, boxX + 10, boxY + 20);

    // Info content
    this.ctx.fillStyle = this.palette.text;
    this.ctx.font = '9px monospace';
    let y = boxY + 40;
    const lineHeight = 15;

    Object.entries(info).forEach(([key, value]) => {
      this.ctx.fillText(
        `${key}: ${value}`,
        boxX + 10,
        y
      );
      y += lineHeight;
    });
  }

  /**
   * Cleanup
   */
  destroy() {
    this.sprites = {};
    this.isInitialized = false;
  }
}

// Export for Node.js / Browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CoreS3Dashboard;
}
