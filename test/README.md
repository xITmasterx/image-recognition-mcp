# Test Documentation

이 프로젝트는 Image Recognition MCP 서버를 테스트하기 위한 두 가지 종류의 테스트를 포함합니다.

## 테스트 파일

### 1. `index.test.ts` - 유닛 테스트
순수한 유닛 테스트로, 외부 API 호출 없이 실행됩니다.

**테스트 범위:**
- `getMimeType` 함수 테스트
- 이미지 파일 검증
- 경로 검증 로직
- 환경 변수 파싱
- 보안 검증 (허용된 디렉토리)
- Data URL 생성

**실행 방법:**
```bash
npm run test:unit
```

**특징:**
- 빠른 실행 (< 1초)
- 외부 의존성 없음
- CI/CD에 적합

### 2. `describe-image-integration.test.ts` - 통합 테스트
실제 OpenAI 호환 API를 호출하는 통합 테스트입니다.

**테스트 범위:**
- 실제 API 호출을 통한 이미지 설명 생성
- 로컬 파일 처리 전체 워크플로우
- URL 기반 이미지 처리
- MCP 도구 응답 포맷 검증
- 에러 핸들링

**실행 방법:**
```bash
npm run test:integration
```

**요구사항:**
- 로컬에서 실행 중인 OpenAI 호환 서버 (예: LM Studio, Ollama)
- 서버 주소: `http://127.0.0.1:1234/v1`
- Vision 모델 (예: qwen/qwen3-vl-4b)

**환경 변수:**
- `OPENAI_BASE_URL`: API 서버 주소
- `OPENAI_MODEL`: 사용할 모델 이름
- `OPENAI_API_KEY`: API 키 (로컬 서버는 임의의 값 사용 가능)
- `ALLOWED_IMAGE_PATHS`: 허용할 이미지 경로 (쉼표로 구분)

## 테스트 이미지

`test/test.png` - 테스트에 사용되는 샘플 이미지
- 크기: ~352KB
- 포맷: PNG
- 용도: 실제 API 호출 및 파일 처리 검증

## 로컬 API 서버 설정

### LM Studio 사용
1. LM Studio 다운로드 및 설치
2. Vision 모델 다운로드 (예: qwen/qwen3-vl-4b)
3. 로컬 서버 시작
4. 서버가 `http://127.0.0.1:1234/v1`에서 실행 중인지 확인

### Ollama 사용
```bash
# Vision 모델 다운로드
ollama pull llava

# API 서버 시작
ollama serve
```

## 테스트 실행 시나리오

### 시나리오 1: 빠른 검증 (유닛 테스트만)
```bash
npm run test:unit
```
- API 서버 불필요
- 빠른 피드백
- 기본 기능 검증

### 시나리오 2: 완전한 통합 테스트
```bash
# 1. 로컬 API 서버 시작 (LM Studio 또는 Ollama)
# 2. 통합 테스트 실행
npm run test:integration
```

### 시나리오 3: 모든 테스트 실행
```bash
npm test
```
- 유닛 테스트와 통합 테스트 모두 실행
- 통합 테스트는 API 서버가 없으면 실패할 수 있음

## 테스트 타임아웃 이슈

통합 테스트는 실제 Vision 모델을 사용하므로 응답 시간이 길 수 있습니다.

**타임아웃이 발생하는 경우:**
1. 로컬 API 서버가 실행 중인지 확인
2. Vision 모델이 로드되었는지 확인
3. 더 작은 이미지로 테스트
4. `describe-image-integration.test.ts`의 타임아웃 값을 증가 (현재: 30초)

**타임아웃 증가 방법:**
테스트 파일에서 각 테스트의 마지막 인자를 수정:
```typescript
it('should describe test.png using real API call', async () => {
  // ... test code
}, 60000); // 30000 -> 60000 (60초)
```

## CI/CD 통합

### GitHub Actions 예제
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
      - run: npm run test:unit  # 유닛 테스트만 실행
```

**참고:** 통합 테스트는 CI/CD에서 실행하기 어려울 수 있습니다 (로컬 API 서버 필요).

## 테스트 결과 예시

### 성공적인 유닛 테스트
```
 ✓ test/index.test.ts  (29 tests) 4ms

 Test Files  1 passed (1)
      Tests  29 passed (29)
```

### 성공적인 통합 테스트 (API 서버 실행 중)
```
Using OpenAI-compatible server at: http://127.0.0.1:1234/v1
Using model: qwen/qwen3-vl-4b

 ✓ should describe test.png using real API call
API Response: This image contains ...

 Test Files  1 passed (1)
      Tests  9 passed (9)
```

### 실패한 통합 테스트 (API 서버 미실행)
```
 ❯ test/describe-image-integration.test.ts > ... > should describe test.png ...
   → Test timed out in 30000ms.
```

## 트러블슈팅

### 문제: "Test timed out"
**해결:**
- 로컬 API 서버 실행 확인
- Vision 모델 로드 확인
- 네트워크 연결 확인

### 문제: "File not found"
**해결:**
- `test/test.png` 파일 존재 확인
- 작업 디렉토리가 프로젝트 루트인지 확인

### 문제: "File path not allowed"
**해결:**
- `ALLOWED_IMAGE_PATHS` 환경 변수에 `./test` 포함 확인

## 추가 정보

더 자세한 정보는 프로젝트 루트의 `README.md`를 참조하세요.
