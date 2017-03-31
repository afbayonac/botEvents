const mongoose = require('mongoose')
const Schema = mongoose.Schema
var debug = require('debug')('botevents:database')

var eventsSchema = new Schema({
  // Valida que el evento sea unico en en la base de dato generando un hast de
  // de los atributos de el eventos que lo representen como la fecha y la
  // description de el evento
  hash: {type: String, unique: true},
  title: String,
  date: Date,
  description: String,
  price: String,
  dateCreated: { type: Date, default: Date.now },
  location: {
    geometry: {
      type: {type: String, default: 'Point'},
      coordinates: {type: [Number], index: '2dsphere'}
    },
    address: String,
    name: String
  },
  url: String
})

// eventsSchema.index({'location.geometry': '2dsphere'})

eventsSchema.pre('save', true, function (next, done, el) {
  // calling next kicks off the next middleware in parallel
  this.hash = require('crypto')
    .createHash('sha256')
    .update(this.description + this.date)
    .digest('hex')

  debug(this)
  next()
  setTimeout(done, 100)
})

module.exports = mongoose.model('events', eventsSchema)
