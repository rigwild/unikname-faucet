import path from 'path'
import express from 'express'

import { SERVER_PORT, GIFT_AMOUNT } from './config'
import { Database } from './db'
import { send } from './lib'

const app = express()
app.set('trust proxy', true)

// Gift SUNS route
app.post('/gift', async (req, res) => {
  try {
    res.set('Content-Type', 'application/json')

    const outAddress = req.query.address

    if (!outAddress)
      throw new Error('You must pass an UNS wallet address.')

    if (!Database.isGiftable(outAddress, req.ip))
      throw new Error('Last SUNS gift was too soon.')

    const sendCommandResult = await send(outAddress, GIFT_AMOUNT)
    Database.add({ address: outAddress, amount: GIFT_AMOUNT, ip: req.ip, timestamp: new Date() })

    res.json(
      sendCommandResult.stdout.length > 0
        ? sendCommandResult.stdout[0]
        : sendCommandResult
    )
  }
  catch (error) {
    res.status(error.stderr ? 409 : 400)
    res.json({ error: error['message'] || error['stderr'] })
  }
})

// Serve application
app.use('/', express.static(path.resolve(__dirname, '..', 'public')))

// Start the server
app.listen(SERVER_PORT, () => console.log(`Server is listening on http://localhost:${SERVER_PORT}`))
