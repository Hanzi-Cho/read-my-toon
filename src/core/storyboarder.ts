import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { ProjectContext, ComicStoryboard, ComicPanel } from "./types";

/**
 * Storyboarder logic holding the system prompt for mapping
 * technical documentation into a webtoon script.
 */
export async function generateStoryboard(
    context: ProjectContext,
    style: string,
    modelName: string = "gpt-4o"
): Promise<ComicStoryboard> {
  const llm = new ChatOpenAI({
    modelName: modelName,
    temperature: 0.7,
  });

  const systemPrompt = `You are a brilliant comic storyboard artist and technical writer.
Your job is to read project documentation and architectural descriptions, and translate them into to a highly engaging, visually stunning webtoon script.
The art style requested is: "${style}".

FORMAT REQUIREMENTS:
Respond ONLY with a valid JSON object matching this structure:
{
  "title": "A catchy title for the project's webtoon",
  "style": "The specified art style applied to prompts",
  "panels": [
    {
      "panelNumber": 1,
      "imagePrompt": "Detailed visual prompt for an image generation model like DALL-E, focusing on layout, character, lighting, and style.",
      "characters": "Brief description of the main characters/elements in the shot",
      "dialogue": "Short text for a speech bubble (max 2 sentences) explaining a feature. Leave empty if purely visual.",
      "action": "Description of what is happening (e.g., 'Looking at a giant glowing server')",
      "relatedCodeSnippet": "A snippet of code from the project related to this panel, if applicable. Can be null.",
      "explanation": "A deeper technical explanation of this scene which will be hidden in a <details> block for the reader."
    }
  ]
}

Make sure the webtoon has a definitive Flow (Introduction -> Core Problem -> Solution/Features -> Conclusion).
Keep the final output between 4 to 8 panels.`;

  const humanInput = `Please create a comic storyboard for the following project:

Project Name: ${context.projectName}
Description: ${context.description}
Tech Stack: ${context.techStack.join(', ')}

README Content (excerpt):
${context.rawReadme.slice(0, 3000)} /* Truncated for token limit */
`;

  console.log('🤖 Invoking LLM for storyboard generation...');
  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(humanInput),
  ]);

  try {
      // Parse JSON from LLM output (accounting for markdown blocks)
      const content = response.content as string;
      const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const storyboard: ComicStoryboard = JSON.parse(jsonStr);
      return storyboard;
  } catch (error) {
      console.error('Failed to parse LLM storyboard output:', response.content);
      throw new Error('Storyboard parsing failed.');
  }
}
