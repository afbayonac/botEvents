// scraped del sitio https://eventsite.com.co/bucaramanga enfocado en eventos en
// colombia [bucaramanga, medellin]

const request = require('request')
const cheerio = require('cheerio')
const $ = cheerio.load

var scraped = (opt) => {
  let page = opt ? opt.pages || 1 : 1

  request({
    baseUrl: 'https://eventsite.com.co',
    method: 'GET',
    uri: '/bucaramanga/eventos',
    qs: {
      page: page
    },
    gzip: true
  }, (err, req, body) => {
    if (err) return console.error(err)

    JSON.parse($(body)('script')
    .attr('type', 'application/ld+json')
    .first()
    .text())
    .forEach((el) => {
      request.post('http://localhost:3000/events', {
        json: {
          idsha: require('crypto')
          .createHash('sha256')
          .update(el.description + el.startDate)
          .digest('hex'),
          name: el.name,
          description: el.description,
          date: el.startDate,
          location: {
            geometry: {
              coordinates: [+el.location.geo.longitude, +el.location.geo.latitude]
            },
            address: el.location.address,
            name: el.location.name
          },
          price: el.offers.lowPrice,
          url: el.url
        }
      }, (err, req, body) => {
        if (err) return console.error(err)
        console.log(el.name.replace(/&quot;/g, '"'))
      })
    })

    if (!$(body)('div .next').attr('class').split(' ')[1]) {
      scraped({pages: page + 1})
    }
  })
}

scraped()
