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

exports.getNear = (req, res, next) => {
  let coordinates = [-73.120258, 7.139285]
  Events
    .find({
      'location.geometry.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: 1000,
          $minDistance: 0
        }
      }
    })
    .limit(5)
    .exec((err, data) => {
      if (err) {
        debug(`err getNear: ${err}`)
        return res.status(500).json({mss: 'error in save'})
      }
      console.log(data)
      return res.status(200).json(data)
    })
}

exports.update = (req, res, next) => {
}
