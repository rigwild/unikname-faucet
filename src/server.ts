import path from 'path'
import express from 'express'

import { SERVER_PORT, GIFT_AMOUNT, GIFT_FEE, GIFT_VENDORFIELD, NETWORK } from './config'
import Database from './db'
import { send, initCrypto, getWalletTokensAmount } from './lib'
import { Network, didResolve } from '@uns/ts-sdk'

const app = express()
app.set('trust proxy', true)

// Gift SUNS route
app.post('/gift', async (req, res) => {
  try {
    res.set('Content-Type', 'application/json')

    // Check there is enough token in faucet's wallet
    if ((await getWalletTokensAmount()) < GIFT_AMOUNT + GIFT_FEE)
      throw new Error('Not enough token left in wallet')

    let outAddress = req.query.walletAddress

    if (!outAddress) throw new Error('You must pass an UNS wallet address or a Unikname.')

    // Resolve the crypto account address if a @unik-name is provided
    if (outAddress.startsWith('@')) {
      const DID_DEFAULT_QUERY = '?*'
      const resolve = await didResolve(
        `${outAddress}${outAddress.endsWith(DID_DEFAULT_QUERY) ? '' : DID_DEFAULT_QUERY}`,
        NETWORK as Network
      )
      if (resolve.error) throw resolve.error
      outAddress = resolve.data as string
    }

    if (!Database.isGiftable(outAddress, req.ip)) throw new Error('Last SUNS gift was too soon.')

    // Send the transaction and save it in databasee
    const [sendResult] = await Promise.all([
      send(outAddress, GIFT_AMOUNT, GIFT_FEE, GIFT_VENDORFIELD),
      Database.add({ address: outAddress, amount: GIFT_AMOUNT, ip: req.ip, timestamp: new Date() })
    ])

    res.json(sendResult)
    // res.json({
    //   data: {
    //     accept: ['0f505c7bdee1234d00f0f42d9e71aaebe918eccb5c4d4f251a64e97de5c469c5'],
    //     broadcast: ['0f505c7bdee1234d00f0f42d9e71aaebe918eccb5c4d4f251a64e97de5c469c5'],
    //     excess: [],
    //     invalid: []
    //   }
    // })
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
})

// Get SUNS tokens amount left
app.get('/tokensLeft', async (req, res) => {
  try {
    res.set('Content-Type', 'application/json')
    res.json({ data: await getWalletTokensAmount() })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get total SUNS tokens gifted
app.get('/giftedTokensTotal', (req, res) => {
  res.set('Content-Type', 'application/json')
  res.json({ data: Database.getGiftedTokensTotal() })
})

// Serve application
app.use('/', express.static(path.resolve(__dirname, '..', 'public')))

export const startServer = async () => {
  // Initialize database
  await Database.init()
  console.log('Database initialized.')

  // Initialize crypto lib
  await initCrypto()
  console.log('Crypto lib initialized.')

  // Start the server
  app.listen(SERVER_PORT, () =>
    console.log(`Server is listening on http://localhost:${SERVER_PORT}`)
  )
}
