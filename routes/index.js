var express = require('express')
var events = require('../controllers/events')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({res: 'server express is runnig'})
})

router.post('/events', events.create)
router.get('/events', events.getNear)
module.exports = router
