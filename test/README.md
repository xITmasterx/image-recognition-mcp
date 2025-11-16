# Test Documentation

This project includes two types of tests for the Image Recognition MCP server.

## Test Files

### 1. `index.test.ts` - Unit Tests
Pure unit tests that run without external API calls.

**Test Coverage:**
- `getMimeType` function tests
- Image file validation
- Path validation logic
- Environment variable parsing
- Security validation (allowed directories)
- Data URL generation

**How to Run:**
```bash
npm run test:unit
```

**Features:**
- Fast execution (< 1 second)
- No external dependencies
- Suitable for CI/CD

### 2. `describe-image-integration.test.ts` - Integration Tests
Integration tests that make actual OpenAI-compatible API calls.

**Test Coverage:**
- Image description generation through actual API calls
- Complete local file processing workflow
- URL-based image processing
- MCP tool response format validation
- Error handling

**How to Run:**
```bash
npm run test:integration
```

**Requirements:**
- A running OpenAI-compatible server locally (e.g., LM Studio, Ollama)
- Server address: `http://127.0.0.1:1234/v1`
- Vision model (e.g., qwen/qwen3-vl-4b)

**Environment Variables:**
- `OPENAI_BASE_URL`: API server address
- `OPENAI_MODEL`: Model name to use
- `OPENAI_API_KEY`: API key (can use any value for local servers)
- `ALLOWED_IMAGE_PATHS`: Allowed image paths (comma-separated)

## Test Image

`test/test.png` - Sample image used in tests
- Size: ~352KB
- Format: PNG
- Purpose: Actual API call and file processing validation

## Local API Server Setup

### Using LM Studio
1. Download and install LM Studio
2. Download a vision model (e.g., qwen/qwen3-vl-4b)
3. Start the local server
4. Verify the server is running at `http://127.0.0.1:1234/v1`

### Using Ollama
```bash
# Download vision model
ollama pull llava

# Start API server
ollama serve
```

## Test Execution Scenarios

### Scenario 1: Quick Validation (Unit Tests Only)
```bash
npm run test:unit
```
- No API server required
- Fast feedback
- Basic functionality verification

### Scenario 2: Complete Integration Test
```bash
# 1. Start local API server (LM Studio or Ollama)
# 2. Run integration tests
npm run test:integration
```

### Scenario 3: Run All Tests
```bash
npm test
```
- Runs both unit and integration tests
- Integration tests may fail if API server is not available

## Test Timeout Issues

Integration tests may take longer to respond as they use actual vision models.

**If timeout occurs:**
1. Verify local API server is running
2. Confirm vision model is loaded
3. Test with a smaller image
4. Increase timeout value in `describe-image-integration.test.ts` (current: 30 seconds)

**How to Increase Timeout:**
Modify the last argument of each test in the test file:
```typescript
it('should describe test.png using real API call', async () => {
  // ... test code
}, 60000); // 30000 -> 60000 (60 seconds)
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:unit  # Run unit tests only
```

**Note:** Integration tests may be difficult to run in CI/CD (requires local API server).

## Test Results Examples

### Successful Unit Tests
```
 ✓ test/index.test.ts  (29 tests) 4ms

 Test Files  1 passed (1)
      Tests  29 passed (29)
```

### Successful Integration Tests (API Server Running)
```
Using OpenAI-compatible server at: http://127.0.0.1:1234/v1
Using model: qwen/qwen3-vl-4b

 ✓ should describe test.png using real API call
API Response: This image contains ...

 Test Files  1 passed (1)
      Tests  9 passed (9)
```

### Failed Integration Tests (API Server Not Running)
```
 ❯ test/describe-image-integration.test.ts > ... > should describe test.png ...
   → Test timed out in 30000ms.
```

## Troubleshooting

### Issue: "Test timed out"
**Solution:**
- Verify local API server is running
- Confirm vision model is loaded
- Check network connection

### Issue: "File not found"
**Solution:**
- Verify `test/test.png` file exists
- Confirm working directory is project root

### Issue: "File path not allowed"
**Solution:**
- Verify `ALLOWED_IMAGE_PATHS` environment variable includes `./test`

## Additional Information

For more details, please refer to the `README.md` in the project root.
