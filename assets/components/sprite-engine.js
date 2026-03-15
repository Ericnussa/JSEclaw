/**
 * Rubi Sprite Animation Engine
 * Phase 3: Avatar Animation System
 *
 * Zero dependencies - pure JavaScript animation engine
 * Supports: idle, blink, talking, thinking state transitions
 * Frame timing: 100-150ms per frame for smooth motion
 */

class SpriteEngine {
  constructor(options = {}) {
    this.spriteWidth = options.spriteWidth || 320;
    this.spriteHeight = options.spriteHeight || 480;
    this.frameTime = options.frameTime || 120; // ms per frame
    this.spritePath = options.spritePath || './assets/sprites/';

    // Sprite cache
    this.sprites = {};
    this.isLoaded = false;
    this.loadedSprites = new Set();

    // Animation state
    this.currentState = 'idle';
    this.isAnimating = false;
    this.animationFrame = 0;
    this.stateTransitionQueue = [];
    this.onStateChange = options.onStateChange || (() => {});

    // Animation definitions
    this.animations = {
      idle: {
        frames: ['idle.png'],
        duration: 4000, // ms, repeats
        frameTime: 500, // ms per frame (slow, static)
        loop: true,
      },
      blink: {
        frames: ['idle.png', 'blink.png', 'idle.png'],
        duration: 600,
        frameTime: 150,
        loop: false,
        next: 'idle',
      },
      talking: {
        frames: ['mouth_closed.png', 'mouth_open.png'],
        duration: 800,
        frameTime: 120,
        loop: true,
      },
      thinking: {
        frames: ['idle.png', 'blink.png', 'idle.png'],
        duration: 1200,
        frameTime: 300,
        loop: true,
      },
      success: {
        frames: ['idle.png', 'blink.png'],
        duration: 400,
        frameTime: 150,
        loop: false,
        next: 'idle',
      },
    };
  }

  /**
   * Load sprite image asynchronously
   * @param {string} spriteName - Name of sprite file (e.g., 'idle.png')
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
        this.loadedSprites.add(spriteName);
        resolve(img);
      };
      img.onerror = () => {
        reject(new Error(`Failed to load sprite: ${spriteName}`));
      };
      img.src = `${this.spritePath}${spriteName}`;
    });
  }

  /**
   * Preload all sprites for an animation state
   * @param {string} stateName - Animation state name
   * @returns {Promise<void>}
   */
  async preloadState(stateName) {
    const animation = this.animations[stateName];
    if (!animation) {
      throw new Error(`Unknown animation state: ${stateName}`);
    }

    const promises = animation.frames.map((frame) => this.loadSprite(frame));
    await Promise.all(promises);
  }

  /**
   * Preload all animations
   * @returns {Promise<void>}
   */
  async preloadAll() {
    const states = Object.keys(this.animations);
    await Promise.all(states.map((state) => this.preloadState(state)));
    this.isLoaded = true;
  }

  /**
   * Get current sprite frame
   * @returns {string} Sprite filename
   */
  getCurrentFrame() {
    const animation = this.animations[this.currentState];
    if (!animation) return 'idle.png';

    const frame = animation.frames[this.animationFrame % animation.frames.length];
    return frame;
  }

  /**
   * Transition to a new animation state
   * Supports queueing multiple states for sequencing
   * @param {string} state - Target state
   * @param {Object} options
   */
  transitionTo(state, options = {}) {
    const animation = this.animations[state];
    if (!animation) {
      console.warn(`Unknown animation state: ${state}`);
      return;
    }

    if (options.queue) {
      this.stateTransitionQueue.push(state);
      return;
    }

    // Reset animation frame for new state
    this.currentState = state;
    this.animationFrame = 0;
    this.onStateChange(state);

    if (!this.isAnimating) {
      this.startAnimation();
    }
  }

  /**
   * Start animation loop
   * @private
   */
  startAnimation() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this._animateFrame();
  }

  /**
   * Stop animation loop
   * @private
   */
  stopAnimation() {
    this.isAnimating = false;
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }

  /**
   * Animate single frame
   * @private
   */
  _animateFrame() {
    if (!this.isAnimating) return;

    const animation = this.animations[this.currentState];
    if (!animation) {
      this.stopAnimation();
      return;
    }

    this.animationFrame++;

    // Check if animation is complete
    const maxFrames = animation.frames.length;
    const isComplete = this.animationFrame >= maxFrames;

    if (isComplete) {
      if (animation.loop) {
        this.animationFrame = 0;
      } else {
        // Transition to next state
        this.stopAnimation();
        const nextState = animation.next || 'idle';

        if (this.stateTransitionQueue.length > 0) {
          const queuedState = this.stateTransitionQueue.shift();
          this.transitionTo(queuedState);
        } else {
          this.transitionTo(nextState);
        }
        return;
      }
    }

    this.animationTimeout = setTimeout(() => {
      this._animateFrame();
    }, animation.frameTime);
  }

  /**
   * Get current sprite image (for rendering)
   * @returns {Image|null}
   */
  getImage() {
    const frameName = this.getCurrentFrame();
    return this.sprites[frameName] || null;
  }

  /**
   * Get animation info (for CLI display)
   * @returns {Object}
   */
  getAnimationInfo() {
    return {
      state: this.currentState,
      frame: this.animationFrame,
      totalFrames: this.animations[this.currentState]?.frames.length || 1,
      isAnimating: this.isAnimating,
      currentSprite: this.getCurrentFrame(),
    };
  }

  /**
   * Reset to idle state
   */
  reset() {
    this.stopAnimation();
    this.currentState = 'idle';
    this.animationFrame = 0;
    this.stateTransitionQueue = [];
    this.startAnimation();
  }

  /**
   * Destroy engine (cleanup)
   */
  destroy() {
    this.stopAnimation();
    this.sprites = {};
    this.loadedSprites.clear();
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SpriteEngine;
}
