const {exec} = require('child_process')
const {resolve} = require('path')
const {promisify} = require('util')

const CWD = process.env.CWD || resolve(__dirname, '..', 'workers')

const execPromise = promisify(exec)

class Hook {
  constructor() {
    this.isRunning = false

    this.nextCallback = null
  }

  async run(params) {
    if (this.isRunning) {
      return this.setToNext(async () => {
        await this.run(params)
      })
    }

    this.isRunning = true

    try {
      const {stderr} = await execPromise('sh gitee_worker.sh', {
        cwd: CWD
      })
      console.log('stderr', stderr)
      if (this.nextCallback) {
        await this.nextCallback()
        this.nextCallback = null
      }
    } catch (error) {
      console.error(error)
    }
    this.isRunning = false

  }

  setToNext(cb) {
    this.nextCallback = cb
  }

}

module.exports = Hook