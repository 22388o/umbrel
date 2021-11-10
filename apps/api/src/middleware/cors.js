const cors = require('cors')

module.exports = cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      origin.match(/^http:\/\/localhost:\d+$/) ||
      origin.match(/^http:\/\/umbrel(.*?).local(:\d+)?$/) ||
      origin.match(`http://${process.env.APP_HIDDEN_SERVICE}`) ||
      origin.match(`http://${process.env.APP_DOMAIN}`)
    ) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
})
