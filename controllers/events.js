const Events = require('../models/events')
var debug = require('debug')('botevents:database')

exports.create = (req, res, next) => {
  let event = req.body

  new Events(event)
    .save((err) => {
      if (err) {
        debug(`save event error : ${err}`)
        return res.status(500).json({mss: 'error in save'})
      }
      return res.status(200).json({mss: 'save ok'})
    })
}

exports.getByID = (req, res, next) => {
}

exports.list = (req, res, next) => {
}

exports.update = (req, res, next) => {
}
