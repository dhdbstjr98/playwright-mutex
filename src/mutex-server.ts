import ipc from 'node-ipc'
import { Socket } from 'net'

import { EVENT, MUTEX_SERVER_NAME } from './constants'

ipc.config.id = MUTEX_SERVER_NAME
ipc.config.retry = 1500
ipc.config.silent = true

if (process.env.DEBUG) {
  ipc.config.silent = false
  ipc.config.logger = console.log
}

interface LockStatus {
  locked: boolean
  socketQueue: Socket[]
}

interface MessageFormat {
  name: string
}

const lockStatusMap: Record<string, LockStatus> = {}

ipc.serve(() => {
  ipc.server.on(EVENT.enter, ({ name }: MessageFormat, socket: Socket) => {
    if (!name) {
      return
    }

    lockStatusMap[name] ??= { locked: false, socketQueue: [] }
    const lockStatus = lockStatusMap[name]

    if (!lockStatus.locked) {
      lockStatus.locked = true
      ipc.server.emit(socket, EVENT.entered, { name })
      return
    }

    lockStatus.socketQueue.push(socket)
  })

  ipc.server.on(EVENT.leave, ({ name }: MessageFormat) => {
    if (!name) {
      return
    }

    const lockStatus = lockStatusMap[name]
    if (!lockStatus) {
      return
    }

    while (lockStatus.socketQueue.length > 0) {
      const nextSocket = lockStatus.socketQueue.shift()
      if (!nextSocket || nextSocket.destroyed) {
        continue
      }

      ipc.server.emit(nextSocket, EVENT.entered, { name })
      return
    }

    lockStatus.locked = false
  })
})

ipc.server.start()
