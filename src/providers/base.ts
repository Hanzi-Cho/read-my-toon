export abstract class BaseImageProvider {
  /**
   * Generates an image URL or buffer given a prompt.
   * @param prompt High-level image generation prompt
   * @param style The artistic style to append
   * @param outputDir The directory to save the image (e.g. .readmytoon/assets)
   * @param index The panel index number
   */
  abstract generateImage(prompt: string, style: string, outputDir: string, index: number): Promise<string>;
}
