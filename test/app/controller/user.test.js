'use strict'

const { app, mock, assert } = require('egg-mock/bootstrap')

describe('test/app/controller/user.test.js', () => {

  const email = '990080536@qq.com'
  const password = '123456abc'
  let sign
  let userId
  let ctx
  beforeEach(() => {
    ctx = app.mockContext()
  })

  describe('sign up', function () {

    it('should sign up a user', async () => {

      ctx.service.user.remove(email)

      const res = await app.httpRequest()
        .post('/api/create')
        .send({
          email: email,
          password: password,
        })
        .expect(200)

      assert(res.body.code === 0)
      userId = res.body.data._id
      sign = ctx.service.auth.genToken(userId)
    })
  })

  describe('update status', function () {

    it('should update a user status', async () => {

      const res = await app.httpRequest()
        .post('/api/users/status')
        .send({
          email: email,
          status: 2,
        })
        .expect(200)

      assert(res.body.code === 0)
    })
  })

  describe('account active', function () {

    it('should active account', async() => {

      const res = await app.httpRequest()
        .get('/api/users/' + userId + '/verify?token=' + sign)
        .expect(200)

      debugger
    })
  })
})
