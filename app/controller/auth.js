'use strict'

const AbstractController = require('./abstract')

class UserController extends AbstractController {
  constructor(ctx) {
    super(ctx)

    this.createUserRule = {
      username: {type: 'string', required: true, allowEmpty: false, format: /^[a-zA-Z0-9_-]{4,16}$/},
      password: {type: 'password', required: true, allowEmpty: false, min: 6},
    }

  }

  /**
   * 注册用户
   * @returns {Promise<void>}
   */
  async reg() {
    // 校验参数
    this.ctx.validate(this.createUserRule)
    // 组装参数
    const payload = this.ctx.request.body
    // 调用 Service 进行业务处理
    let user = await this.service.user.getByEmail(payload.email)
    if (user) {
      this.error('此邮箱已被注册')
    }

    user = await this.service.user.create(payload)
    //发送激活账号邮件
    this.service.email.sendActiveMail(user)
    user.token = this.createToken(user)
    delete user.passwordHash
    this.success(user)
  }

  /**
   * 用户登录
   * @returns {Promise<void>}
   */
  async login () {
    // 校验参数
    this.ctx.validate(this.createUserRule)
    const payload = this.ctx.request.body
    let user = await this.service.user.getByUsername(payload.username)
    if (!user) {
      this.error('用户不存在')
    }

    if (user.auth(payload.password)) {
      user = user.toObject()
      if(!user.enable){
        this.error('用户被阻止登录')
      }
      delete user.passwordHash
      user.token = this.createToken(user)
      this.success(user)
    } else {
      this.error('用户名或密码错误')
    }
  }

  /**
   * 用户注销
   * @returns {Promise<void>}
   */
  async logout () {

    //清除登录后所缓存信息

    this.success('用户注销成功')
  }
}
module.exports = UserController
