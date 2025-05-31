# 🧱 playwright-mutex

> 🔒 Playwright 워커 간 공유 상태 충돌을 방지하는 뮤텍스 시스템

**playwright-mutex**는 [Playwright](https://playwright.dev) E2E 테스트 환경에서  
여러 워커가 동시에 실행될 때 발생할 수 있는 **동시성 이슈를 해결**하기 위해 만들어졌습니다.

간단한 설정만으로 테스트 간 락을 걸어 **flaky한 테스트를 방지**할 수 있습니다.

## 📦 설치 방법

```bash
npm install playwright-mutex
```

## ⚙️ 사용법

### 1. Playwright 설정에 추가

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  globalSetup: require.resolve('./globalSetup.ts'),
  globalTeardown: require.resolve('./globalTeardown.ts'),
})
```

```ts
// globalSetup.ts
import { setup } from 'playwright-mutex'

const globalSetup = async () => {
  await setup()
}

export default globalSetup
```

```ts
// globalTeardown.ts
import { teardown } from 'playwright-mutex'

const globalTeardown = async () => {
  await teardown()
}

export default globalTeardown
```

### 2. 테스트 코드에서 사용

#### 방법1) enterMutexTest, leaveMutexTest 사용

```ts
import { enterMutexTest, leaveMutexTest } from 'playwright-mutex'

test.describe('상품찜 테스트', async () => {
  test('상품찜이 가능해야 한다.', async () => {
    await enterMutexTest(상품번호)

    // your test code

    leaveMutexTest()
  })
})
```

#### 방법2) setMutexTest 사용

```ts
import { setMutexTest } from 'playwright-mutex'

test.describe('상품찜 테스트', async () => {
  setMutexTest(상품번호) // test.beforeAll 에서 enterMutexTest 실행, test.afterAll에서 leaveMutexTest 실행한다.

  test('상품찜이 가능해야 한다.', async () => {
    // your test code
  })
})
```

## 🧪 작동 방식

- `globalSetup`에서 mutex server를 `child_process.spawn`으로 실행
- 각 테스트 워커는 IPC 소켓을 통해 서버에 접속
- 이름별로 lock 큐가 FIFO 방식으로 동작
- `globalTeardown`에서 서버 자동 종료

## 📄 라이선스

MIT © dhdbstjr98

## 🔗 관련 링크

- [NPM 패키지](https://www.npmjs.com/package/playwright-mutex)
