var bcrypt = require('bcryptjs') //引入加密模块

module.exports = app => {
  const mongoose = app.mongoose
  const UserSchema = new mongoose.Schema({
    username: {type: String, default: ''},//名字
    email: {type: String, required: true},//邮箱
    mobile: { type: String},
    passwordHash: {type: String, default: ''},//密码
    is_admin: Boolean,//用户权限组,true:admin组;false:visitor组
    login_info: [
      {
        login_time: Date,//登录时间
        login_ip: String,//登录IP地址
      }
    ],
    position: {type: String, default: '职位'},//职位
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    avatar: { type: String, default: 'https://1.gravatar.com/avatar/a3e54af3cb6e157e496ae430aed4f4a3?s=96&d=mm'},
    personal_state: {type: String, default: '我的称述'},//我的称述
    createdAt: { type: Date, default: Date.now },
    enable: { type: Boolean, default: true }, //用户是否有效
    activated: {type: Boolean, default: false}
  })

  UserSchema
    .virtual('password')
    .set(function (password) {
      var salt = bcrypt.genSaltSync(10)
      this.passwordHash = bcrypt.hashSync(password, salt)
    })
    .get(function () { return this.passwordHash })

  UserSchema.methods = {
    auth: function (password) {
      return bcrypt.compareSync(password, this.passwordHash)
    }
  }

  UserSchema.index({email: 1})

  return mongoose.model('User', UserSchema)
}
