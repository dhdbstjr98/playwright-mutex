import test from '@playwright/test'

import { wait } from './util'
import { setMutexTest } from '../../src/test'

test.describe('first', () => {
  setMutexTest('mutex1', 'mutex2')
  test('first-1 test', async () => {
    console.log(`first-1, process id: ${process.pid}`)
    await wait(1000)
  })
  test('first-2 test', async () => {
    console.log(`first-2, process id: ${process.pid}`)
    await wait(1000)
  })
})
