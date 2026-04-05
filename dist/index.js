#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/cli/index.ts
var import_commander = require("commander");
var path2 = __toESM(require("path"));
var dotenv = __toESM(require("dotenv"));

// src/core/analyzer.ts
var fs = __toESM(require("fs/promises"));
var path = __toESM(require("path"));
async function analyzeProject(targetPath) {
  const packageJsonPath = path.join(targetPath, "package.json");
  const readmePath = path.join(targetPath, "README.md");
  let projectName = "Unknown Project";
  let description = "No description provided.";
  let techStack = [];
  let rawReadme = "";
  try {
    const pkgRaw = await fs.readFile(packageJsonPath, "utf8");
    const pkg = JSON.parse(pkgRaw);
    if (pkg.name) projectName = pkg.name;
    if (pkg.description) description = pkg.description;
    if (pkg.dependencies) {
      techStack.push(...Object.keys(pkg.dependencies));
    }
    if (pkg.devDependencies) {
      techStack.push(...Object.keys(pkg.devDependencies));
    }
  } catch (error) {
    console.warn("\u26A0\uFE0F package.json not found or could not be processed. Falling back to default project info.");
  }
  try {
    rawReadme = await fs.readFile(readmePath, "utf8");
    if (projectName === "Unknown Project") {
      const match = rawReadme.match(/^#\s+(.+)$/m);
      if (match && match[1]) {
        projectName = match[1].trim();
      }
    }
  } catch (error) {
    console.warn(`\u26A0\uFE0F README.md not found in ${targetPath}. The generated toon might lack context.`);
  }
  return {
    projectName,
    description,
    keyFeatures: ["Automated Setup", "AI-Driven Generation"],
    // Placeholder for now
    techStack,
    rawReadme
  };
}

// src/cli/index.ts
dotenv.config();
var program = new import_commander.Command();
program.name("readmytoon").description("Convert your project README into an interactive AI Webtoon").version("1.0.0").argument("[targetPath]", "Path to the project directory", ".").option("-s, --style <style>", "Art style for the webtoon (e.g., cyberpunk, anime, pixel art)", "modern tech startup").option("-o, --output <file>", "Output markdown file name", "READMYTOON.md").option("--llm <provider>", "LLM Provider for storyboard generation", "openai").option("--image <provider>", "Image generation provider", "openai").option("--debug", "Enable debug logging", false).action(async (targetPath, options) => {
  const absolutePath = path2.resolve(process.cwd(), targetPath);
  console.log(`\u{1F680} Starting ReadMyToon for: ${absolutePath}`);
  console.log(`\u{1F3A8} Art Style: ${options.style}`);
  try {
    console.log("\u{1F50D} Analyzing project context...");
    const context = await analyzeProject(absolutePath);
    if (options.debug) {
      console.log("\u2705 Context extracted:", JSON.stringify(context, null, 2));
    } else {
      console.log(`\u2705 Extracted context for: ${context.projectName}`);
    }
    console.log("\u{1F6A7} Main pipeline under development...");
  } catch (error) {
    console.error("\u274C Error generating webtoon:", error);
    process.exit(1);
  }
});
program.parse(process.argv);
