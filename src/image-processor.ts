import fs from "fs";
import path from "path";

/**
 * Get MIME type from file extension
 */
export function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    default:
      throw new Error(`Unsupported extension for MIME type: ${ext}`);
  }
}

/**
 * Read image file and convert to base64 data URL
 */
export function convertImageToDataUrl(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = fileBuffer.toString('base64');
  const mimeType = getMimeType(filePath);

  return `data:${mimeType};base64,${base64Data}`;
}

/**
 * Create image content object for local file
 */
export function createLocalImageContent(filePath: string): { type: "image_url"; image_url: { url: string } } {
  const dataUrl = convertImageToDataUrl(filePath);
  return {
    type: "image_url",
    image_url: { url: dataUrl }
  };
}

/**
 * Create image content object for URL
 */
export function createUrlImageContent(imageUrl: string): { type: "image_url"; image_url: { url: string } } {
  return {
    type: "image_url",
    image_url: { url: imageUrl }
  };
}
