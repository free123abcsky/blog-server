
const crypto = require('crypto')
const Service = require('egg').Service

class AuthService extends Service {

  /**
   * 生成token
   * @param userId
   * @returns {*|PromiseLike<ArrayBuffer>}
   */
  genToken (userId) {
    const md5 = crypto.createHash('md5')
    return md5.update(this.config.jwt.secret + userId).digest('hex')
  }
}


module.exports = AuthService