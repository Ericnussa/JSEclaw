#!/usr/bin/env node

/**
 * Demo: Rubi Avatar CLI Animation
 * Phase 3: Terminal Display Integration
 *
 * Demonstrates all animation states in the terminal
 */

const SpriteEngine = require("../assets/components/sprite-engine.js");
const CLIRenderer = require("../assets/components/cli-renderer.js");

// Configuration
const CONFIG = {
  spritePath: "./assets/sprites/",
  updateInterval: 100, // ms
  demoMode: true,
};

class CLIAvatarDemo {
  constructor() {
    this.engine = new SpriteEngine({
      spritePath: CONFIG.spritePath,
      frameTime: 120,
    });

    this.renderer = new CLIRenderer({
      useColor: true,
      useASCII: false,
    });

    this.isRunning = false;
  }

  async initialize() {
    console.clear();
    console.log(this.renderer.colorize("🤖 JSEBot Rubi Avatar - CLI Demo 🤖", "bright"));
    console.log(this.renderer.colorize("════════════════════════════════════", "cyan"));

    try {
      console.log("\n  Loading Rubi avatar sprites...");
      await this.engine.preloadAll();
      console.log(this.renderer.colorize("  ✓ All sprites loaded", "green"));
      return true;
    } catch (error) {
      console.error(this.renderer.colorize(`  ✗ Failed to load: ${error.message}`, "red"));
      return false;
    }
  }

  async runDemo() {
    this.isRunning = true;

    // Demo sequence
    await this.demoStartup();
    await this.demoIdle();
    await this.demoThinking();
    await this.demoTalking();
    await this.demoSuccess();
    await this.demoError();
    await this.demoBlinking();
    await this.demoEnd();

    this.isRunning = false;
  }

  async demoStartup() {
    console.clear();
    console.log(this.renderer.colorize("═══════════════════════════════════════", "cyan"));
    console.log(this.renderer.colorize("         1️⃣  STARTUP STATE", "bright"));
    console.log(this.renderer.colorize("═══════════════════════════════════════", "cyan"));

    this.renderer.showStartup();
    await this.sleep(3000);
  }

  async demoIdle() {
    console.clear();
    console.log(this.renderer.colorize("═══════════════════════════════════════", "cyan"));
    console.log(this.renderer.colorize("         2️⃣  IDLE STATE", "bright"));
    console.log(this.renderer.colorize("═══════════════════════════════════════", "cyan"));

    this.engine.transitionTo("idle");
    this.renderer.showPrompt();
    this.renderer.printMessage("Waiting for input...", "info");
    await this.sleep(2000);
  }

  async demoThinking() {
    console.clear();
    console.log(this.renderer.colorize("═══════════════════════════════════════", "cyan"));
    console.log(this.renderer.colorize("         3️⃣  THINKING STATE", "bright"));
    console.log(this.renderer.colorize("═══════════════════════════════════════", "cyan"));

    this.engine.transitionTo("thinking");
    console.log();

    // Animated thinking
    for (let i = 0; i < 15; i++) {
      const spinner = this.renderer.getSpinnerFrame();
      process.stdout.write(
        `\r${this.renderer.colorize(`  ${spinner} Processing your input...`, "magenta")}`,
      );
      await this.sleep(200);
    }
    console.log();
    await this.sleep(500);
  }

  async demoTalking() {
    console.clear();
    console.log(this.renderer.colorize("═══════════════════════════════════════", "cyan"));
    console.log(this.renderer.colorize("         4️⃣  TALKING STATE", "bright"));
    console.log(this.renderer.colorize("═══════════════════════════════════════", "cyan"));

    this.engine.transitionTo("talking");
    console.log();

    const message = "Hello! I am Rubi, your personal AI assistant. How can I help you today?";
    const words = message.split(" ");

    console.log(this.renderer.colorize("  💬 Rubi:", "magenta"));
    for (const word of words) {
      process.stdout.write(`  ${word} `);
      await this.sleep(100);
    }
    console.log("\n");
    await this.sleep(1000);
  }

  async demoSuccess() {
    console.clear();
    console.log(this.renderer.colorize("═══════════════════════════════════════", "cyan"));
    console.log(this.renderer.colorize("         5️⃣  SUCCESS STATE", "bright"));
    console.log(this.renderer.colorize("═══════════════════════════════════════", "cyan"));

    this.engine.transitionTo("success");
    this.renderer.showSuccess("Task completed successfully!");
    await this.sleep(2000);
  }

  async demoError() {
    console.clear();
    console.log(this.renderer.colorize("═══════════════════════════════════════", "cyan"));
    console.log(this.renderer.colorize("         6️⃣  ERROR STATE", "bright"));
    console.log(this.renderer.colorize("═══════════════════════════════════════", "cyan"));

    this.engine.transitionTo("error");
    this.renderer.showError("Something went wrong. Please try again.");
    await this.sleep(2000);
  }

  async demoBlinking() {
    console.clear();
    console.log(this.renderer.colorize("═══════════════════════════════════════", "cyan"));
    console.log(this.renderer.colorize("         7️⃣  BLINKING ANIMATION", "bright"));
    console.log(this.renderer.colorize("═══════════════════════════════════════", "cyan"));

    console.log();
    console.log(this.renderer.colorize("  🤖 Demonstrating natural eye blinks...", "magenta"));
    console.log();

    for (let i = 0; i < 4; i++) {
      this.engine.transitionTo("blink");
      const spinner = this.renderer.getSpinnerFrame();
      process.stdout.write(`\r${this.renderer.colorize(`  Blink ${i + 1}/4 ${spinner}`, "cyan")}`);
      await this.sleep(600);
    }
    console.log();
    await this.sleep(500);
  }

  async demoEnd() {
    console.clear();
    console.log(this.renderer.colorize("═══════════════════════════════════════", "bright"));
    console.log(this.renderer.colorize("  ✨ Demo Complete! ✨", "green"));
    console.log(this.renderer.colorize("═══════════════════════════════════════", "bright"));

    console.log();
    this.renderer.printMessage("All animation states demonstrated", "success");

    console.log(this.renderer.colorize("\n  📚 Integration Guide:", "cyan"));
    console.log(this.renderer.colorize("     See assets/docs/PHASE-3-INTEGRATION.md", "cyan"));

    console.log(this.renderer.colorize("\n  🎬 More Demos:", "cyan"));
    console.log(this.renderer.colorize("     npm run demo:handheld", "cyan"));
    console.log(this.renderer.colorize("     npm run demo:coresia", "cyan"));

    console.log(this.renderer.colorize("\n═══════════════════════════════════════\n", "bright"));
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async cleanup() {
    this.engine.destroy();
    console.log(this.renderer.colorize("\n  Goodbye! 👋", "magenta"));
  }
}

// Main execution
async function main() {
  const demo = new CLIAvatarDemo();

  try {
    const ready = await demo.initialize();
    if (!ready) {
      process.exit(1);
    }

    // Small delay for effect
    await demo.sleep(1000);

    // Run demo
    await demo.runDemo();

    // Cleanup
    await demo.cleanup();
  } catch (error) {
    console.error("Demo error:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  void main();
}

module.exports = CLIAvatarDemo;
