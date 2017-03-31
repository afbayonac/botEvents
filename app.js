var express = require('express')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var debug = require('debug')('botevents:database')
var cfg = require('./config/config')

var index = require('./routes/index')

var app = express()

// Conection mongodb
mongoose
.connect(`mongodb://localhost:${cfg.db.mongo.port}/events`,
  { config: { autoIndex: false } })
var mongodb = mongoose.connection
mongodb.on('error', (e) => debug(
  `connection error : ${e}`
  ))
mongodb.once('open', () => debug(
  `Conection mongodb ok
    port: ${cfg.db.mongo.port}
  `))

// config app express
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/', index)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  console.log(res.app.get('env'))
  res.locals.error =
    ['development', 'test'].indexOf(req.app.get('env')) !== -1 ? err : {}

  // render the error page
  res.status(err.status || 500)
  // TODO test error
  res.json({error: err.message})
})

module.exports = app
