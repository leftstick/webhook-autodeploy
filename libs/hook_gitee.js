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

    const execCmd = this.getCmd(params)
    const shell = exec(execCmd, {
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

  // set exec command according to repository name temporarily
  // may change as demand changes
  getCmd(params) {
    let command = ''
    switch (params.repository.name) {
      case 'uwa-answer-next-version':
        command = 'sh gitee_worker.sh'
        break
      case 'uwa-main-site-next-version':
        command = 'sh mainsite_autodeploy.sh'
        break
      default: 
        break
    }
    return command
  }

}

module.exports = Hook
