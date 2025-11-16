import { describe, it, expect, beforeAll } from 'vitest';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { createLocalImageContent } from '../src/image-processor.js';
import { validateLocalPath } from '../src/path-validator.js';

/**
 * Integration tests for describe-image MCP tool
 * These tests call a real OpenAI-compatible API endpoint
 *
 * Environment variables required:
 * - OPENAI_BASE_URL: http://127.0.0.1:1234/v1
 * - OPENAI_MODEL: qwen/qwen3-vl-4b
 * - OPENAI_API_KEY: any value (for local server)
 */

// Constants
const DEFAULT_BASE_URL = 'http://127.0.0.1:1234/v1';
const DEFAULT_MODEL = 'qwen/qwen3-vl-4b';
const ALLOWED_PATHS = ['./images', './assets', './test'];

describe('describe-image Real API Integration Tests', () => {
  let openai: OpenAI;
  const testImagePath = './test/test.png';
  const baseUrl = process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL;
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;

  beforeAll(() => {
    // Initialize OpenAI client with local server
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'not-needed-for-local',
      baseURL: baseUrl,
    });
  });

  describe('Local File Image Description with Real API', () => {
    it('should describe test.png using real API call', async () => {
      const imagePath = testImagePath;
      const absolutePath = path.resolve(imagePath);

      // Step 1: Verify file exists
      expect(fs.existsSync(absolutePath)).toBe(true);

      // Step 2: Validate path using validateLocalPath function
      const validatedPath = validateLocalPath(imagePath, ALLOWED_PATHS, false);
      expect(validatedPath).toBe(absolutePath);

      // Step 3: Create image content using the actual function
      const imageContent = createLocalImageContent(absolutePath);

      // Step 4: Call real API
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: "이 이미지 속의 사이트에 대해 간략하게 설명해주세요." },
              imageContent,
            ],
          },
        ],
      });

      // Step 5: Validate response
      expect(response).toBeDefined();
      expect(response.choices).toBeDefined();
      expect(response.choices.length).toBeGreaterThan(0);
      expect(response.choices[0].message.content).toBeTruthy();

      // Step 6: Validate response content
      const responseText = response.choices[0].message.content ?? '';
      expect(responseText.length).toBeGreaterThan(0);
    }, 120000); // 120 second timeout for API call
  });


  describe('Error Handling with Real API', () => {
    it('should throw error for non-existent file path', () => {
      const imageUrl = './test/non-existent-image.png';

      expect(() => {
        validateLocalPath(imageUrl, ALLOWED_PATHS, false);
      }).toThrow('File not found');
    });

    it('should throw error for unauthorized path', () => {
      const imageUrl = '/etc/test.png'; // Outside allowed paths with valid extension

      expect(() => {
        validateLocalPath(imageUrl, ALLOWED_PATHS, false);
      }).toThrow('File path not allowed');
    });
  });

  describe('Different Image Formats Support', () => {
    it('should handle PNG format correctly', () => {
      const pngPath = './test/test.png';
      const absolutePath = path.resolve(pngPath);

      // File must exist for test to be valid
      expect(fs.existsSync(absolutePath)).toBe(true);

      // Use the actual function to create image content
      const imageContent = createLocalImageContent(absolutePath);

      expect(imageContent).toBeDefined();
      expect(imageContent.type).toBe('image_url');
      expect(imageContent.image_url.url).toMatch(/^data:image\/png;base64,/);
    });
  });

});
