# 🧱 playwright-mutex

> 🔒 A mutex system to prevent shared-state conflicts between Playwright workers

🌐 Available in other languages: [한국어 README](./README.ko.md)

**playwright-mutex** is designed to resolve **concurrency issues** that can occur when multiple Playwright workers run in parallel during E2E testing.

With minimal configuration, it ensures mutual exclusion between tests and helps prevent **flaky** behavior caused by shared state.

## 📦 Installation

```bash
npm install playwright-mutex
```

## ⚙️ Usage

### 1. Add to your Playwright configuration

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

### 2. Use in your test files

#### Option 1: Using `enterMutexTest` and `leaveMutexTest`

```ts
import { enterMutexTest, leaveMutexTest } from 'playwright-mutex'

test.describe('Favorite Product Test', () => {
  test('should be able to favorite a product', async () => {
    await enterMutexTest(productId)

    // your test code here

    leaveMutexTest()
  })
})
```

#### Option 2: Using `setMutexTest`

```ts
import { setMutexTest } from 'playwright-mutex'

test.describe('Favorite Product Test', () => {
  setMutexTest(productId) // Calls enterMutexTest in beforeAll and leaveMutexTest in afterAll

  test('should be able to favorite a product', async () => {
    // your test code here
  })
})
```

## 🧪 How It Works

- The mutex server is spawned in `globalSetup` using `child_process.spawn`
- Each Playwright worker connects to the server via an IPC socket
- Locks are managed in a FIFO queue based on a given name
- The server is gracefully terminated in `globalTeardown`

## 📄 License

MIT © dhdbstjr98

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/playwright-mutex)
