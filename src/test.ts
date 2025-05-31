import ipc from 'node-ipc'

import { MUTEX_SERVER_NAME, MUTEX_CLIENT_NAME_PREFIX } from './constants'
import test from '@playwright/test'

ipc.config.id = `${MUTEX_CLIENT_NAME_PREFIX}${process.pid}`
ipc.config.silent = true

if (process.env.DEBUG) {
  ipc.config.silent = false
  ipc.config.logger = console.log
}

let connected = false

const connect = () =>
  new Promise<void>((res) => {
    if (connected) {
      return res()
    }

    ipc.connectTo(MUTEX_SERVER_NAME)
    ipc.of[MUTEX_SERVER_NAME].on('connect', () => {
      connected = true
      res()
    })
  })

const enter = (name: string) =>
  new Promise<void>(async (res) => {
    ipc.of[MUTEX_SERVER_NAME].on('entered', ({ name: enteredName }) => {
      if (enteredName === name) {
        res()
      }
    })
    ipc.of[MUTEX_SERVER_NAME].emit('enter', { name })
  })

export const enterMutexTest = async (name: string) => {
  await connect()
  return enter(name)
}

export const leaveMutexTest = (name: string) => {
  ipc.of[MUTEX_SERVER_NAME]?.emit?.('leave', { name })
}

export const setMutexTest = (...names: string[]) => {
  test.beforeAll(async () => {
    await connect()
    await Promise.all(names.map((name) => enter(name)))
  })

  test.afterAll(() => names.forEach((name) => leaveMutexTest(name)))
}
