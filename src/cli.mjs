#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { argv } from "process";
import { createInterface } from "readline";

const configDir = join(homedir(), ".jsebot");
const configFile = join(configDir, "config.json");

const version = "0.5.2";

const loadConfig = () => {
  if (!existsSync(configFile)) {
    return null;
  }
  return JSON.parse(readFileSync(configFile, "utf-8"));
};

const saveConfig = (config) => {
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }
  writeFileSync(configFile, JSON.stringify(config, null, 2));
};

const showHelp = () => {
  console.log(`
JSEBot - Your Personal AI Assistant

Usage:
  jsebot              Start chatting
  jsebot onboard      Set up for first time
  jsebot --help       Show this help
  jsebot --version    Show version
  `);
};

const showVersion = () => {
  console.log(`JSEBot v${version}`);
};

const onboard = async () => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

  console.log("Welcome to JSEBot! Let's set you up.\n");

  const name = await question("What's your name? ");
  const channel =
    (await question(
      "Where do you want to chat? (telegram/whatsapp/slack/discord/local) [local] ",
    )) || "local";
  const model = (await question("Which AI model? (claude/gpt/local) [claude] ")) || "claude";

  const config = { name, channel, model };
  saveConfig(config);

  rl.close();
  console.log("\n✅ Setup complete! Run `jsebot` to start chatting.\n");
};

const chat = async () => {
  const config = loadConfig();
  if (!config) {
    console.log("No configuration found. Run `jsebot onboard` first.\n");
    return;
  }

  console.log(`👋 Hi ${config.name}! Type your messages below. Type 'exit' to quit.\n`);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = () => {
    rl.question("you: > ", async (input) => {
      if (input.toLowerCase() === "exit") {
        rl.close();
        console.log("\nGoodbye! 👋\n");
        return;
      }

      console.log(`jsebot: I received your message: "${input}". Feature coming soon!\n`);
      askQuestion();
    });
  };

  askQuestion();
};

const main = async () => {
  const cmd = argv[2];

  if (!cmd || cmd === "chat") {
    await chat();
  } else if (cmd === "onboard") {
    await onboard();
  } else if (cmd === "--version" || cmd === "-v") {
    showVersion();
  } else if (cmd === "--help" || cmd === "-h") {
    showHelp();
  } else {
    console.log(`Unknown command: ${cmd}\n`);
    showHelp();
  }
};

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
