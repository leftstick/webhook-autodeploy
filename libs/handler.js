const HOOK_SCRIPT = process.env.ACTIVE_HOOK || 'hook_gitee'

const Hook = require(`./${HOOK_SCRIPT}`)

class Handler {

  constructor(interval) {
    this.interval = interval
    this.lastBuild = null

    this.hook = new Hook()
  }

  run(params) {
    const now = new Date()

    if (!this.lastBuild) {
      this.lastBuild = now
      return this.hook.run(params)
    }

    if (now - this.lastBuild > this.interval) {
      this.lastBuild = now
      return this.hook.run(params)
    }

    console.warn('build request comes too often, this one will be queued')
    
    setTimeout(() => {
      this.lastBuild = new Date()
      this.hook.run(params)
    }, this.interval - (now - this.lastBuild))
  }

}

module.exports = Handler
