const TelegramBot = require('node-telegram-bot-api')
const cfg = require('../config/config')

var bot = new TelegramBot(cfg.telegram.token, {pulling: true})

module.exports = bot
