var express = require('express');
var bodyParser = require('body-parser');
var SenecaWeb = require('seneca-web');
var Passport = require('passport');
var PassportJwt = require('passport-jwt')
var Router = express.Router;
var context = new Router();

var ExtractJwt = PassportJwt.ExtractJwt
var JwtStrategy = PassportJwt.Strategy

var jwtOptions = {}
jwtOptions.jwtFromRequest = PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = '123456789'

var strategy = new JwtStrategy(jwtOptions, async function(payload, next) {
      next(null, payload)
})

Passport.use(strategy)

Passport.serializeUser((sector, cb) => {
      cb(null, sector)
  })

Passport.deserializeUser((sector, cb) => {
      cb(null, sector)
  })


var app = express()
      .use( require('body-parser').json() )
      .use(Passport.initialize())
      .use( context )

var senecaWebConfig = {
      context: context,
      adapter: require('seneca-web-adapter-express'),
      options: { parseBody: false },
      auth: Passport
}

var seneca = require('seneca')()
      .use(SenecaWeb, senecaWebConfig )
      .use('seneca-amqp-transport')
      .use("entity")
      .use('api')
      .client({
          type: 'amqp',
          pin: 'role:sector',
          port: process.env.RABBITMQ_PORT,
          username: process.env.RABBITMQ_DEFAULT_USER,
          password: process.env.RABBITMQ_DEFAULT_PASS,
          url: 'amqp://' + process.env.RABBITMQ_HOST
      })
      .ready(() => {
            app.listen(8080)
      })
