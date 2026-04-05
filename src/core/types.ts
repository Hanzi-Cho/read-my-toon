export interface ProjectContext {
  projectName: string;
  description: string;
  keyFeatures: string[];
  techStack: string[];
  usageExample?: string;
  rawReadme: string;
}

export interface ComicPanel {
  panelNumber: number;
  imagePrompt: string; // The prompt given to the Image model
  characters: string; // Description of characters in the panel
  dialogue?: string; // Text to put in speech bubble
  action: string; // Action happening in the scene
  relatedCodeSnippet?: string; // Code to display when panel/bubble is clicked
  explanation?: string; // Text to show in the <details> block
}

export interface ComicStoryboard {
  title: string;
  style: string;
  panels: ComicPanel[];
}

export interface ReadMyToonOptions {
  style: string;
  output: string;
  llm: string;
  image: string;
  debug: boolean;
}
