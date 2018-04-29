const Controller = require('egg').Controller
class AbstractController extends Controller {
  success (data) {
    this.ctx.status = 200
    this.ctx.body = {}
    if (typeof data === 'string') {
      this.ctx.body.msg = data
    }else{
      this.ctx.body.data = data
    }
    this.ctx.body.code = 0
  }
  error (data, code = 403) {
    if (typeof data === 'string') {
      this.ctx.throw(code, data)
    } else {
      this.ctx.throw(data.code, data.msg)
    }
  }
  notFound (msg) {
    msg = msg || 'not found'
    this.ctx.throw(404, msg)
  }

  createToken (user) {
    return this.ctx.app.jwt.sign(user, this.config.jwt.secret, {
      expiresIn: 60 * 24 * 30
    })
  }
}
module.exports = AbstractController
