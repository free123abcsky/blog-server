'use strict';

const Controller = require('egg').Controller;

class TagController extends Controller {
  async index() {
    this.ctx.body = 'tag, egg';
  }
}

module.exports = TagController;
