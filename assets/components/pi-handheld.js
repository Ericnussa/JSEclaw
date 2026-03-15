/**
 * Raspberry Pi 5 Handheld Renderer
 * Phase 3: Lightweight Display Integration (320x480)
 *
 * Optimized for resource-constrained Raspberry Pi 5 with 320x480 display
 * Uses HTML5 Canvas for efficient rendering
 * Fallback to terminal output if display unavailable
 */

class PiHandheldRenderer {
  constructor(options = {}) {
    this.width = options.width || 320;
    this.height = options.height || 480;
    this.canvasId = options.canvasId || 'handheld-canvas';
    this.spritePath = options.spritePath || './assets/sprites/';
    this.enableGPU = options.enableGPU !== false;

    // Canvas references
    this.canvas = null;
    this.ctx = null;
    this.isInitialized = false;

    // Sprite cache (minimize memory)
    this.sprites = {};
    this.maxCacheSize = 10 * 1024 * 1024; // 10MB max cache
    this.currentCacheSize = 0;

    // Performance settings
    this.fps = options.fps || 30; // Lower FPS = lower CPU usage
    this.frameTime = 1000 / this.fps;
    this.lastFrameTime = 0;

    // Animation state
    this.currentState = 'idle';
    this.animationFrame = 0;
    this.isAnimating = false;
    this.animation = null;

    // Touch interaction
    this.touchActive = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  /**
   * Initialize canvas rendering context
   * @returns {boolean} Success status
   */
  initialize() {
    try {
      if (typeof document === 'undefined') {
        console.warn(
          'PiHandheldRenderer: DOM not available, using fallback mode'
        );
        return false;
      }

      this.canvas = document.getElementById(this.canvasId);
      if (!this.canvas) {
        console.warn(`Canvas element not found: ${this.canvasId}`);
        return false;
      }

      this.ctx = this.canvas.getContext('2d', {
        alpha: true,
        antialias: false, // Disable for better performance
      });

      // Set canvas size (crisp pixel rendering)
      this.canvas.width = this.width;
      this.canvas.height = this.height;

      // Setup touch handlers
      this._setupTouchHandlers();

      // Enable hardware acceleration if available
      if (this.enableGPU && this.ctx.canvas.getContext) {
        try {
          const gpuCtx = this.ctx.canvas.getContext('webgl');
          if (gpuCtx) {
            console.log('GPU acceleration enabled');
          }
        } catch (e) {
          console.log('GPU acceleration not available');
        }
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Canvas initialization failed:', error);
      return false;
    }
  }

  /**
   * Load and cache sprite image
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
        // Check cache size
        const imgSize = img.width * img.height * 4; // RGBA
        if (this.currentCacheSize + imgSize > this.maxCacheSize) {
          // Clear oldest cached sprite
          const oldestKey = Object.keys(this.sprites)[0];
          delete this.sprites[oldestKey];
          this.currentCacheSize -=
            oldestKey.width * oldestKey.height * 4;
        }

        this.sprites[spriteName] = img;
        this.currentCacheSize += imgSize;
        resolve(img);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load sprite: ${spriteName}`));
      };

      img.src = `${this.spritePath}${spriteName}`;
    });
  }

  /**
   * Render current frame to canvas
   * Optimized for 30 FPS on Pi 5
   */
  render() {
    if (!this.isInitialized || !this.ctx) return;

    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;

    // Frame rate limiting (achieve target FPS)
    if (deltaTime < this.frameTime) {
      requestAnimationFrame(() => this.render());
      return;
    }

    this.lastFrameTime = now;

    // Clear canvas with dark background
    this.ctx.fillStyle = '#0a0e27'; // Dark blue (JSEBot branding)
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw current sprite
    this._drawSprite();

    // Draw UI elements
    this._drawStatus();
    this._drawControls();

    // Continue animation loop
    requestAnimationFrame(() => this.render());
  }

  /**
   * Draw sprite on canvas
   * @private
   */
  _drawSprite() {
    const sprite = this.sprites[this.currentState];
    if (!sprite) return;

    // Center sprite vertically, with margin at top for status
    const topMargin = 20;
    const x = (this.width - sprite.width) / 2;
    const y = topMargin;

    this.ctx.drawImage(
      sprite,
      x,
      y,
      sprite.width,
      sprite.height
    );
  }

  /**
   * Draw status bar at bottom
   * @private
   */
  _drawStatus() {
    const statusBar = {
      x: 0,
      y: this.height - 60,
      width: this.width,
      height: 60,
    };

    // Background
    this.ctx.fillStyle = 'rgba(10, 14, 39, 0.95)';
    this.ctx.fillRect(
      statusBar.x,
      statusBar.y,
      statusBar.width,
      statusBar.height
    );

    // Border
    this.ctx.strokeStyle = '#00d4ff'; // Neon cyan
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      statusBar.x + 1,
      statusBar.y + 1,
      statusBar.width - 2,
      statusBar.height - 2
    );

    // Status text
    this.ctx.fillStyle = '#00d4ff';
    this.ctx.font = 'bold 12px monospace';
    this.ctx.textAlign = 'left';

    const statusText = `State: ${this.currentState.toUpperCase()}`;
    this.ctx.fillText(statusText, 10, statusBar.y + 20);

    // FPS counter (debug)
    const fps = Math.round(1000 / this.frameTime);
    this.ctx.fillText(`FPS: ${fps}`, 10, statusBar.y + 40);

    // Memory indicator
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const mem = Math.round(
        process.memoryUsage().heapUsed / 1024 / 1024
      );
      this.ctx.fillText(`Mem: ${mem}MB`, this.width - 70, statusBar.y + 40);
    }
  }

  /**
   * Draw interactive buttons
   * @private
   */
  _drawControls() {
    const buttonHeight = 30;
    const buttonWidth = (this.width - 20) / 2;
    const startY = this.height - 45;

    // Left button: Settings
    this._drawButton(
      5,
      startY,
      buttonWidth,
      buttonHeight,
      '⚙️ Settings',
      'left'
    );

    // Right button: Refresh
    this._drawButton(
      this.width - buttonWidth - 5,
      startY,
      buttonWidth,
      buttonHeight,
      '🔄 Refresh',
      'right'
    );
  }

  /**
   * Draw single button
   * @private
   */
  _drawButton(x, y, width, height, label, align) {
    // Button background
    this.ctx.fillStyle = '#1a2351';
    this.ctx.fillRect(x, y, width, height);

    // Button border (active state)
    this.ctx.strokeStyle = '#00d4ff';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, width, height);

    // Button text
    this.ctx.fillStyle = '#00d4ff';
    this.ctx.font = '11px monospace';
    this.ctx.textAlign = align === 'left' ? 'left' : 'right';
    const textX = align === 'left' ? x + 5 : x + width - 5;
    this.ctx.fillText(label, textX, y + 20);
  }

  /**
   * Set animation state
   * @param {string} state
   * @param {Object} animationDef
   */
  setState(state, animationDef) {
    this.currentState = state;
    this.animation = animationDef;
    this.animationFrame = 0;
  }

  /**
   * Setup touch event handlers
   * @private
   */
  _setupTouchHandlers() {
    if (!this.canvas) return;

    this.canvas.addEventListener('touchstart', (e) => {
      this.touchActive = true;
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    });

    this.canvas.addEventListener('touchend', () => {
      this.touchActive = false;
    });

    this.canvas.addEventListener('touchmove', (e) => {
      if (!this.touchActive) return;

      const deltaX = e.touches[0].clientX - this.touchStartX;
      const deltaY = e.touches[0].clientY - this.touchStartY;

      // Swipe detection (minimal 50px)
      if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
        this._handleSwipe(deltaX, deltaY);
        this.touchActive = false;
      }
    });
  }

  /**
   * Handle swipe gesture
   * @private
   * @param {number} deltaX
   * @param {number} deltaY
   */
  _handleSwipe(deltaX, deltaY) {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Horizontal swipe
    if (absX > absY) {
      if (deltaX > 0) {
        console.log('Swipe right');
      } else {
        console.log('Swipe left');
      }
    }
    // Vertical swipe
    else {
      if (deltaY > 0) {
        console.log('Swipe down');
      } else {
        console.log('Swipe up');
      }
    }
  }

  /**
   * Get memory usage (debug)
   * @returns {Object}
   */
  getMemoryInfo() {
    if (typeof process === 'undefined') return null;

    const mem = process.memoryUsage();
    return {
      heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
      cacheSize: Math.round(this.currentCacheSize / 1024 / 1024),
    };
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    if (this.canvas) {
      this.canvas.removeEventListener('touchstart', null);
      this.canvas.removeEventListener('touchend', null);
      this.canvas.removeEventListener('touchmove', null);
    }
    this.sprites = {};
    this.isInitialized = false;
  }
}

// Export for Node.js / Browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PiHandheldRenderer;
}
