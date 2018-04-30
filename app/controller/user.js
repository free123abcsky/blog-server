'use strict'

const AbstractController = require('./abstract')

class UserController extends AbstractController {
  constructor(ctx) {
    super(ctx)

    this.userRule = {
        username: {type: 'string', required: true, allowEmpty: false, min: 6, max: 20, format: /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/},
        password: {type: 'password', required: true, allowEmpty: false, min: 6, max: 20, format: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/},
        mobile: {type: 'string', required: true, allowEmpty: false, format: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$/},
        email: {type: 'string', required: true, allowEmpty: false, format: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/},
        desc: {type: 'string', required: false, max: 500}
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
     * 用户添加
     * @returns {Promise<void>}
     */
    async addUser() {
        // 校验参数
        this.ctx.validate(this.userRule)
        // 组装参数
        const payload = this.ctx.request.body
        // 调用 Service 进行业务处理
        let user = await this.service.user.getByUsername(payload.username)
        if (user) {
            this.error('此用户名已被注册')
        }
        user = await this.service.user.getByEmail(payload.email)
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
     * 账号激活
     * @returns {Promise<void>}
     */
    async activeAccount () {

        const userId = this.ctx.params.userId
        const token = this.ctx.query.token
        const testToken = this.service.auth.genToken(userId)

        if (token !== testToken) {
            this.error('帐号验证失败')
        }

        let user = await this.service.user.getById(userId)

        if(!user){
            this.error('账号不存在')
        }

        if (!user.activated) {
            user.activated = true
            user = await this.service.user.update(userId, user)
        }
        delete user.passwordHash
        user.token = this.createToken(user)
        this.success(user)
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
