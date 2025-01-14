const { LNMarketsWebsocket } = require('@ln-markets/api')
const { Server } = require('ws')

const log = require('@/logger/index.js')

const OPEN = 1

module.exports = async (server) => {
  try {
    const lnm = new LNMarketsWebsocket({ network: process.env.BITCOIN_NETWORK })
    const ws = new Server({
      server,
      maxPayload: 1024,
      clientTracking: true,
    })

    lnm.on('connected', (message) => {
      log.info(`Connected to ${lnm.hostname} websockets`)
    })

    lnm.on('message', (message) => {
      ws.clients.forEach((client) => {
        if (client.readyState === OPEN) {
          client.send(JSON.stringify(message))
        }
      })
    })

    await lnm.connect()
    await lnm.subscribe({
      params: ['futures/market/index', 'futures/market/bid-offer'],
    })
  } catch (error) {
    return Promise.reject(error)
  }
}
