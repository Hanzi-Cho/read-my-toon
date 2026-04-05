import * as fs from 'fs/promises';
import * as path from 'path';
import { ProjectContext } from './types';

/**
 * Parses the package.json and README.md of a directory to extract project context.
 * 
 * @param targetPath The root folder to analyze
 * @returns ProjectContext containing the gathered information
 */
export async function analyzeProject(targetPath: string): Promise<ProjectContext> {
  const packageJsonPath = path.join(targetPath, 'package.json');
  const readmePath = path.join(targetPath, 'README.md');
  
  let projectName = 'Unknown Project';
  let description = 'No description provided.';
  let techStack: string[] = [];
  let rawReadme = '';

  // 1. Analyze package.json
  try {
    const pkgRaw = await fs.readFile(packageJsonPath, 'utf8');
    const pkg = JSON.parse(pkgRaw);
    
    if (pkg.name) projectName = pkg.name;
    if (pkg.description) description = pkg.description;
    
    // Extract dependencies as pseudo-tech stack
    if (pkg.dependencies) {
      techStack.push(...Object.keys(pkg.dependencies));
    }
    if (pkg.devDependencies) {
      techStack.push(...Object.keys(pkg.devDependencies));
    }
  } catch (error) {
    console.warn('⚠️ package.json not found or could not be processed. Falling back to default project info.');
  }

  // 2. Extract raw README
  try {
    rawReadme = await fs.readFile(readmePath, 'utf8');
    
    // Fallback name if package.json was missing but README has an H1
    if (projectName === 'Unknown Project') {
      const match = rawReadme.match(/^#\s+(.+)$/m);
      if (match && match[1]) {
        projectName = match[1].trim();
      }
    }
  } catch (error) {
    console.warn(`⚠️ README.md not found in ${targetPath}. The generated toon might lack context.`);
  }

  // NOTE: Simple extraction for now.
  // In a more robust system, we would parse the markdown AST to extract specific code snippets or features.
  return {
    projectName,
    description,
    keyFeatures: ['Automated Setup', 'AI-Driven Generation'], // Placeholder for now
    techStack,
    rawReadme
  };
}
