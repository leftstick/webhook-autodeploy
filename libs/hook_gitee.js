const {exec} = require('child_process')
const {resolve} = require('path')

const CWD = process.env.CWD || resolve(__dirname, '..', 'workers')

class Hook {
  constructor() {
    this.isRunning = false

    this.nextCallback = null
  }

  run(params) {
    if (this.isRunning) {
      return this.setToNext(async () => {
        await this.run(params)
      })
    }

    this.isRunning = true

    const shell = exec('sh gitee_worker.sh', {
      cwd: CWD
    }, async (error, stdout, stderr) => {
      if (error) {
        console.error(error)
      }
      console.log('Task finished')
      if (this.nextCallback) {
        await this.nextCallback()
        this.nextCallback = null
      }
      this.isRunning = false
    })

    shell.stdout.pipe(process.stdout)

    shell.stderr.pipe(process.stderr)

  }

  setToNext(cb) {
    this.nextCallback = cb
  }

}

module.exports = Hook