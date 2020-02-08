import path from 'path'
import express from 'express'

import { SERVER_PORT, GIFT_AMOUNT, GIFT_FEE, GIFT_VENDORFIELD } from './config'
import { Database } from './db'
import { send, initCrypto } from './lib'

const app = express()
app.set('trust proxy', true)

// Initialize crypto lib
initCrypto().then(() => console.log('Crypto lib initialized.'))

// Gift SUNS route
app.post('/gift', async (req, res) => {
  try {
    res.set('Content-Type', 'application/json')

    const outAddress = req.query.address

    if (!outAddress)
      throw new Error('You must pass an UNS wallet address.')

    if (!Database.isGiftable(outAddress, req.ip))
      throw new Error('Last SUNS gift was too soon.')

    const sendResult = await send(outAddress, GIFT_AMOUNT, GIFT_FEE, GIFT_VENDORFIELD)
    Database.add({ address: outAddress, amount: GIFT_AMOUNT, ip: req.ip, timestamp: new Date() })

    res.json(sendResult)
  }
  catch (error) {
    res.status(409).json({ error: error.message })
  }
})

// Serve application
app.use('/', express.static(path.resolve(__dirname, '..', 'public')))

// Start the server
app.listen(SERVER_PORT, () => console.log(`Server is listening on http://localhost:${SERVER_PORT}`))
