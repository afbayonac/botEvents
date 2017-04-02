const TelegramBot = require('node-telegram-bot-api')
const cfg = require('../config/config')
const debug = require('debug')('botevents:bottelegram')
const Events = require('../models/events')

var bot = new TelegramBot(cfg.telegram.token, {pulling: true})

bot.setWebHook(`https://${cfg.telegram.url}/${cfg.telegram.token}`)
  .then((a) => {
    if (a) debug(`setWebHook ${cfg.url}/`)
  })

bot.onText(/^\/start(.*)/, (msg, match) => {
  const chatId = msg.chat.id
  const resp =
`
Soy eventsbot, estoy para ayudarte a buscar eventos interesantes

Comandos
/eventshere - lista los eventos cercanos
`
  var opts = {}
  bot.sendMessage(chatId, resp, opts)
})

bot.onText(/^\/eventshere(.*)/, (msg, match) => {
  const resp =
`
Para poder conenser los eventos que estan cerca nesesitamos tu localizacion
`
  var opts = {
    parse_mode: 'Markdown',
    reply_markup: JSON.stringify({
      force_reply: true,
      keyboard: [
        [{text: 'Mi localización', request_location: true}],
        [{text: 'No Gracias'}]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  )}
  bot.sendMessage(msg.chat.id, resp, opts)
      .then(
        bot.once('location', sendEventshere)
      )
})

function sendEventshere (msg) {
  Events
    .find({
      'location.geometry.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [msg.location.longitude, msg.location.latitude]
          },
          $maxDistance: 10000,
          $minDistance: 0
        }
      }
    })
    .limit(5)
    .exec((err, events) => {
      if (err) {
        debug(`err getNear: ${err}`)
      }
      var opts = {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_markup: JSON.stringify({
          remove_keyboard: true
        }
      )}
      bot.sendMessage(msg.chat.id, reslocation(events), opts)
    })
}

function reslocation (events) {
  let rest = ''
  for (var i in events) {
    rest =
`
${rest}
[${events[i].title}](${events[i].url})
`
  }
  return rest
}

// TODO modularizar el bot
module.exports = bot
