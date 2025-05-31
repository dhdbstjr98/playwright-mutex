import { spawn } from 'child_process'
import fs from 'fs/promises'
import path from 'path'

import { MUTEX_SERVER_PID_FILE } from './constants'

const isTsRuntime = __filename.endsWith('.ts')
const mutexServerEntryFile = isTsRuntime
  ? path.join(__dirname, 'mutex-server.ts')
  : path.join(__dirname, 'mutex-server.js')

const isWindows = process.platform === 'win32'
const tsNode = path.join(
  process.cwd(),
  'node_modules',
  '.bin',
  isWindows ? 'ts-node.cmd' : 'ts-node'
)

const cmd = isTsRuntime ? tsNode : 'node'

const setup = async () => {
  const mutexProcess = spawn(cmd, [mutexServerEntryFile], {
    stdio: process.env.DEBUG ? 'inherit' : 'ignore',
  })

  await fs.writeFile(MUTEX_SERVER_PID_FILE, String(mutexProcess.pid))

  return mutexProcess.pid
}

export { setup }
