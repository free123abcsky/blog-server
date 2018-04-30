const Service = require('egg').Service

class UserService extends Service {

  async create(payload) {
    return (await this.ctx.model.User({
      email: payload.email,
      password: payload.password
    }).save()).toObject()
  }

  async remove(email) {
    return this.ctx.model.User.remove({ email: email })
  }

  async update (id, user) {
    return this.ctx.model.User.findOneAndUpdate({
      _id: id
    }, user).lean()
  }


  async getByUsername (username) {
     return this.ctx.model.User.findOne({username})
  }

  async getByEmail (email) {
     return this.ctx.model.User.findOne({email})
  }

  async getById (id) {
    return this.ctx.model.User.findOne({_id: id}).lean()
  }


}


module.exports = UserService
