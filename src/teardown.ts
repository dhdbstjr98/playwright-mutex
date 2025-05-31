import fs from 'fs/promises'

import { MUTEX_SERVER_PID_FILE } from './constants'

const teardown = async () => {
  try {
    const pid = await fs.readFile(MUTEX_SERVER_PID_FILE, 'utf-8')
    process.kill(parseInt(pid), 'SIGTERM')
  } catch {
    // ignore
  } finally {
    await fs.unlink(MUTEX_SERVER_PID_FILE).catch(() => {})
  }
}

export { teardown }
