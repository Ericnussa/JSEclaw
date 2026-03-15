/**
 * Demo: Rubi Avatar - Pi 5 Handheld Display
 * Phase 3: 320x480 Display Integration
 *
 * HTML page demonstrating Pi 5 handheld Rubi avatar
 * Open in browser or electron window
 */

class HandheldDemo {
  constructor() {
    this.engine = new SpriteEngine({
      spritePath: "./assets/sprites/",
      frameTime: 120,
    });

    this.renderer = new PiHandheldRenderer({
      canvasId: "handheld-canvas",
      width: 320,
      height: 480,
      fps: 30,
    });

    this.isRunning = false;
    this.demoState = 0;
  }

  async initialize() {
    console.log("🤖 Initializing Pi 5 Handheld Demo...");

    // Initialize renderer
    if (!this.renderer.initialize()) {
      console.error("Failed to initialize canvas");
      this.showFallback("Canvas initialization failed");
      return false;
    }

    // Load sprites
    try {
      console.log("Loading sprites...");
      await this.engine.preloadAll();
      console.log("✓ Sprites loaded");
    } catch (error) {
      console.error("Sprite loading failed:", error);
      this.showFallback(`Sprite loading failed: ${error.message}`);
      return false;
    }

    // Setup event listeners
    this.setupEventListeners();

    // Start rendering
    this.renderer.render();
    console.log("✓ Handheld demo ready");

    return true;
  }

  setupEventListeners() {
    // Button handlers
    const settingsBtn = document.getElementById("btn-settings");
    const demoBtn = document.getElementById("btn-demo");
    const stateButtons = document.querySelectorAll(".state-btn");

    if (settingsBtn) {
      settingsBtn.addEventListener("click", () => {
        this.showSettings();
      });
    }

    if (demoBtn) {
      demoBtn.addEventListener("click", () => {
        void this.runDemo();
      });
    }

    stateButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const state = btn.dataset.state;
        this.engine.transitionTo(state);
        this.renderer.setState(state);
        this.updateStateDisplay(state);
      });
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "1":
          this.engine.transitionTo("idle");
          break;
        case "2":
          this.engine.transitionTo("blink");
          break;
        case "3":
          this.engine.transitionTo("thinking");
          break;
        case "4":
          this.engine.transitionTo("talking");
          break;
        case "5":
          this.engine.transitionTo("success");
          break;
        case " ":
          e.preventDefault();
          void this.runDemo();
          break;
      }
    });
  }

  async runDemo() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;

    const sequence = [
      { state: "idle", duration: 1000 },
      { state: "thinking", duration: 2000 },
      { state: "talking", duration: 2500 },
      { state: "success", duration: 800 },
      { state: "blink", duration: 600 },
      { state: "idle", duration: 1000 },
    ];

    for (const item of sequence) {
      this.engine.transitionTo(item.state);
      this.renderer.setState(item.state);
      this.updateStateDisplay(item.state);
      await this.sleep(item.duration);
    }

    this.isRunning = false;
  }

  showSettings() {
    // Show settings overlay
    const modal = document.getElementById("settings-modal");
    if (modal) {
      modal.style.display = "flex";
    }
  }

  closeSettings() {
    const modal = document.getElementById("settings-modal");
    if (modal) {
      modal.style.display = "none";
    }
  }

  updateStateDisplay(state) {
    const display = document.getElementById("state-display");
    if (display) {
      display.textContent = state.toUpperCase();

      // Color code by state
      const colors = {
        idle: "#00d4ff",
        blink: "#00ffff",
        thinking: "#ff00ff",
        talking: "#00ff00",
        success: "#00ff00",
        error: "#ff0055",
      };

      display.style.color = colors[state] || "#00d4ff";
    }
  }

  showFallback(message) {
    const canvas = document.getElementById("handheld-canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#0a0e27";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ff0055";
      ctx.font = "16px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Error", canvas.width / 2, canvas.height / 2 - 20);

      ctx.fillStyle = "#e0e0e0";
      ctx.font = "12px monospace";
      ctx.fillText(message, canvas.width / 2, canvas.height / 2 + 20);
    }
  }

  getMemoryInfo() {
    const info = this.renderer.getMemoryInfo();
    if (info) {
      return `Heap: ${info.heapUsed}MB / ${info.heapTotal}MB | Cache: ${info.cacheSize}MB`;
    }
    return "N/A";
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  destroy() {
    this.renderer.destroy();
    this.engine.destroy();
  }
}

// Initialize when page loads
let demo;

document.addEventListener("DOMContentLoaded", () => {
  demo = new HandheldDemo();
  void demo.initialize().then((success) => {
    if (success) {
      console.log("Demo initialized successfully");

      // Update memory display
      setInterval(() => {
        const memDisplay = document.getElementById("memory-display");
        if (memDisplay) {
          memDisplay.textContent = demo.getMemoryInfo();
        }
      }, 1000);

      // Initial state
      demo.engine.transitionTo("idle");
      demo.renderer.setState("idle");
      demo.updateStateDisplay("idle");
    }
  });

  // Close settings on X button
  const closeBtn = document.getElementById("close-settings");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => demo.closeSettings());
  }
});

// Cleanup on unload
window.addEventListener("beforeunload", () => {
  if (demo) {
    demo.destroy();
  }
});
