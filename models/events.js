const mongoose = require('mongoose')
const Schema = mongoose.Schema
var debug = require('debug')('botevents:database')

var eventsSchema = new Schema({
  // Valida que el evento sea unico en en la base de dato generando un hast de
  // de los atributos de el eventos que lo representen como la fecha y la
  // description de el evento
  idsha: {type: String, unique: true},
  tittle: String,
  date: Date,
  description: String,
  price: String,
  dateCreated: { type: Date, default: Date.now },
  location: {
    geometry: {
      type: {type: String, default: 'Point'},
      coordinates: []
    },
    address: String,
    name: String
  },
  url: String
})

eventsSchema.pre('save', true, function (next, done) {
  // calling next kicks off the next middleware in parallel
  debug('ok')
  next()
  setTimeout(done, 100)
})

module.exports = mongoose.model('events', eventsSchema)
