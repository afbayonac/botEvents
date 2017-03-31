var express = require('express')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var debug = require('debug')('botevents:database')

var index = require('./routes/index')

var app = express()

// Conection mongodb
mongoose.connect('mongodb://localhost/events', { config: { autoIndex: false } })
var mongodb = mongoose.connection
mongodb.on('error', (e) => debug(`connection error : ${e}`))
mongodb.once('open', () => debug('connection ok'))
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  // TODO test error
  res.json({error: err.message})
})

module.exports = app
