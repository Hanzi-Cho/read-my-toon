#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { ReadMyToonOptions } from '../core/types';
import { analyzeProject } from '../core/analyzer';
import { generateStoryboard } from '../core/storyboarder';
import { renderMarkdown } from '../core/renderer';
import { OpenAIDALLEProvider } from '../providers/image/openai';

// Load environment variables (.env file if it exists)
dotenv.config();

const program = new Command();

program
  .name('readmytoon')
  .description('Convert your project README into an interactive AI Webtoon')
  .version('1.0.0')
  .argument('[targetPath]', 'Path to the project directory', '.')
  .option('-s, --style <style>', 'Art style for the webtoon (e.g., cyberpunk, anime, pixel art)', 'modern tech startup')
  .option('-o, --output <file>', 'Output markdown file name', 'READMYTOON.md')
  .option('--llm <provider>', 'LLM Provider for storyboard generation', 'openai')
  .option('--image <provider>', 'Image generation provider', 'openai')
  .option('--debug', 'Enable debug logging', false)
  .action(async (targetPath: string, options: ReadMyToonOptions) => {
    const absolutePath = path.resolve(process.cwd(), targetPath);
    const readmytoonDir = path.join(absolutePath, '.readmytoon');
    const assetsDir = path.join(readmytoonDir, 'assets');

    console.log(`🚀 Starting ReadMyToon for: ${absolutePath}`);
    console.log(`🎨 Art Style: ${options.style}`);
    
    try {
      // Setup .readmytoon directory
      await fs.mkdir(assetsDir, { recursive: true });

      // Step 1: Analyze Project
      console.log('🔍 Analyzing project context...');
      const context = await analyzeProject(absolutePath);
      
      if (options.debug) {
        console.log('✅ Context extracted:', JSON.stringify(context, null, 2));
      } else {
        console.log(`✅ Extracted context for: ${context.projectName}`);
      }

      // Step 2: Generate Storyboard using LLM
      console.log('📝 Designing Webtoon Storyboard...');
      // Select LLM (OpenAI/Gemini based on provider, defaulting to GPT-4o logic in storyboarder)
      const storyboard = await generateStoryboard(context, options.style, process.env.STORY_MODEL || "gpt-4o");
      console.log(`✅ Storyboard created: "${storyboard.title}" with ${storyboard.panels.length} panels.`);

      // Step 3: Generate Images Using Image Provider
      console.log('🖌️ Illustrating panels... (This may take a minute)');
      let imageProvider: any;
      
      if (options.image === 'openai') {
        imageProvider = new OpenAIDALLEProvider();
      } else {
        // Fallback or other plugins
        console.warn('⚠️ Unknown image provider. Falling back to OpenAI DALL-E.');
        imageProvider = new OpenAIDALLEProvider();
      }

      const imageMap: Record<number, string> = {};
      
      // Generate serially to avoid rate limits
      for (const panel of storyboard.panels) {
        const relativeUrl = await imageProvider.generateImage(panel.imagePrompt, storyboard.style, assetsDir, panel.panelNumber);
        // Normalize paths for Markdown
        imageMap[panel.panelNumber] = relativeUrl.replace(/\\/g, '/');
      }
      
      // Step 4: Render Final READMYTOON.md
      console.log('📜 Assembling Interactive Webtoon...');
      await renderMarkdown(storyboard, imageMap, absolutePath, options.output);

      console.log(`🎉 Success! Your webtoon is ready at ${path.join(absolutePath, options.output)}`);

    } catch (error) {
      console.error('❌ Error generating webtoon:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);
