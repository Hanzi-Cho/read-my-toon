import { OpenAI } from "openai";
import { BaseImageProvider } from "../base";
import * as fs from 'fs/promises';
import * as path from 'path';

export class OpenAIDALLEProvider extends BaseImageProvider {
  private openai: OpenAI;

  constructor() {
    super();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateImage(prompt: string, style: string, outputDir: string, index: number): Promise<string> {
    const finalPrompt = `In the style of ${style}: ${prompt}. Keep it illustrative and clear. Make it look like a webtoon panel.`;
    console.log(`🖼️  Generating Image for panel ${index}...`);
    
    try {
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: finalPrompt,
        n: 1,
        size: "1024x1024",
        response_format: "url", // In prod, we'd base64 and save to disk
      });

      const imageUrl = response.data?.[0]?.url;
      if (!imageUrl) throw new Error("No image returned from DALL-E");
      
      // Feature: Download Image locally to .readmytoon/assets/
      const imgRes = await fetch(imageUrl);
      const buffer = await imgRes.arrayBuffer();
      const filename = `panel-${index}.png`;
      const localPath = path.join(outputDir, filename);
      
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(localPath, Buffer.from(buffer));
      console.log(`✅ Saved panel ${index} to ${localPath}`);

      return `.readmytoon/assets/${filename}`;
    } catch (error) {
       console.error(`❌ Optional Fallback: Failed to generate DALL-E image. Using placeholder.`, error);
       return `https://via.placeholder.com/1024x1024?text=Panel+${index}`;
    }
  }
}
