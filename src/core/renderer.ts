import * as fs from 'fs/promises';
import * as path from 'path';
import { ComicStoryboard, ComicPanel } from './types';

/**
 * Renders the interactive READMYTOON.md file from a storyboard.
 */
export async function renderMarkdown(
  storyboard: ComicStoryboard, 
  imagesOutputMap: Record<number, string>,
  outputDir: string,
  outputFileName: string
): Promise<string> {
  const lines: string[] = [];

  // Header
  lines.push(`<!-- READMYTOON GENERATED DOCUMENT -->`);
  lines.push(`# 📚 ${storyboard.title}`);
  lines.push(`> 🎨 **Style:** ${storyboard.style} | ⚡ Powered by ReadMyToon`);
  lines.push('');

  for (const panel of storyboard.panels) {
    const imageUrl = imagesOutputMap[panel.panelNumber];
    
    // Panel Wrapper (Interactive Anchor)
    lines.push(`---`);
    lines.push(`### 🎬 Panel ${panel.panelNumber}: ${panel.action}`);
    
    // Clickable Image (using anchor to a details block or raw image)
    lines.push(`[![${panel.action}](${imageUrl})](#details-panel-${panel.panelNumber})`);
    
    if (panel.dialogue) {
      lines.push(`> 💬 **${panel.characters}:** "${panel.dialogue}"`);
    }

    // Behind-the-Scenes interactive expanding section (Deep Dive)
    if (panel.explanation || panel.relatedCodeSnippet) {
      lines.push('');
      lines.push(`<details id="details-panel-${panel.panelNumber}">`);
      lines.push(`<summary>🔍 <b>Deep Dive: What's happening here?</b></summary>`);
      lines.push('');
      if (panel.explanation) {
        lines.push(`${panel.explanation}`);
        lines.push('');
      }
      if (panel.relatedCodeSnippet) {
        lines.push('```javascript'); // Format code based on project tech stack optionally
        lines.push(`${panel.relatedCodeSnippet}`);
        lines.push('```');
      }
      lines.push(`</details>`);
      lines.push('');
    }
  }

  lines.push(`---`);
  lines.push(`*Generated with [ReadMyToon](https://github.com/example/read-my-toon). Turn your project into an interactive webtoon today!*`);

  const mdContent = lines.join('\n');
  const outputPath = path.join(outputDir, outputFileName);
  
  await fs.writeFile(outputPath, mdContent, 'utf8');
  console.log(`✅ Webtoon successfully rendered to ${outputPath}`);
  
  return mdContent;
}
