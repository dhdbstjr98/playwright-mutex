import path from 'path'

export const MUTEX_SERVER_PID_FILE = path.join(__dirname, 'mutex-server.pid')
export const MUTEX_SERVER_NAME = 'playwright-mutex-server'
export const MUTEX_CLIENT_NAME_PREFIX = 'playwright-mutex-client-'

export const EVENT = {
  enter: 'enter',
  entered: 'entered',
  leave: 'leave',
} as const
