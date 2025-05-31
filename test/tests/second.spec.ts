import test from '@playwright/test'

import { wait } from './util'
import { setMutexTest } from '../../src/test'

test.describe('second', () => {
  setMutexTest('mutex2')
  test('second-1 test', async () => {
    console.log(`second-1, process id: ${process.pid}`)
    await wait(1000)
  })
  test('second-2 test', async () => {
    console.log(`second-2, process id: ${process.pid}`)
    await wait(1000)
  })
})
