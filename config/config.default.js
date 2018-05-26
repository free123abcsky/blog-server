'use strict'

module.exports = appInfo => {
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1513779989145_1674'

  // 加载 errorHandler 中间件
  config.middleware = [ 'errorHandler']

/*  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
      methodnoallow: {
          enable: false
      },
      domainWhiteList: [ 'http://localhost:8081' ],
  }*/

    config.security =  {
       csrf: false,
       debug: 'csrf-disable',
       domainWhiteList: [ 'http://localhost:8082' ]
    }

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/b_dev',
    options: {
      useMongoClient: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0,
    },
  }

  config.bcrypt = {
    saltRounds: 10 // default 10
  }

  config.jwt = {
    secret: 'xxx-aaa-bbb-ccc',
    enable: false, // default is false
  }

  // 发送邮件配置
  config.transporter = {
    appName: '别智网',
    service: '163',
    auth: {
      user: 'fansuo_k@163.com',
      pass: 'xdqm@yx412kfs'
    }
  }

  config.cors= {
      origin: '*',
     allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
     credentials: true
  }

  return config
}
