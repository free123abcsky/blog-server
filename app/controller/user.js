'use strict'

const AbstractController = require('./abstract')

class UserController extends AbstractController {
  constructor(ctx) {
    super(ctx)

    this.createUserRule = {
      email: {type: 'string', required: true, allowEmpty: false, format: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/},
      password: {type: 'password', required: true, allowEmpty: false, min: 6},
    }

  }

  /**
   * 用户列表
   * @returns {Promise<void>}
   */
  async list () {


    const users = []
    this.success(users)
  }

  /**
   * 用户状态更新
   * @returns {Promise<void>}
   */
  async changeStatus () {

    const {email, status} = this.ctx.request.body
    let user = await this.service.user.getByEmail(email)
    if(!user){
      this.error('账号不存在')
    }
    await this.service.user.update(user._id, {status: status})
    if(status === 2){
      this.success('用户禁用成功')
    }else{
      this.success('用户启用成功')
    }

  }

  /**
   * 重置密码
   * @returns {Promise<void>}
   */
  async resetPassword () {

    const payload = this.ctx.request.body
    let user = await this.service.user.getByEmail(payload.email)
    if(!user){
      this.error('账号不存在')
    }
    await this.service.user.update(user._id, {status: payload.status})
    if(payload.status === 2){
      this.success('用户禁用成功')
    }else{
      this.success('用户启用成功')
    }

  }

}
module.exports = UserController
