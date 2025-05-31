import { teardown } from '../src/teardown'

const globalTeardown = async () => {
  await teardown()
}

export default globalTeardown
