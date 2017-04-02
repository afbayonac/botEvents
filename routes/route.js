const express = require('express')
const events = require('../controllers/events')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({res: 'server express is runnig'})
})

router.post('/events', events.create)
router.get('/events', events.getNear)
module.exports = router
