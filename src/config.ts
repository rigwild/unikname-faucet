import path from 'path'
import dotenvSafe from 'dotenv-safe'

// Load environment configuration
dotenvSafe.config({
  path: path.resolve(__dirname, '..', '.env'),
  example: path.resolve(__dirname, '..', '.env.example'),
  allowEmptyValues: true
})

const env = process.env as { [key: string]: string }
export const {
  NETWORK,
  PASSPHRASE,
  SECOND_PASSPHRASE,
  GIFT_VENDORFIELD,
  DATABASE_CLEANUP_CRONTIME
} = env
export const SERVER_PORT = parseInt(env.SERVER_PORT, 10)
export const GIFT_INTERVAL_DELAY_MS = parseInt(env.GIFT_INTERVAL_DELAY_MS, 10)
export const GIFT_AMOUNT = parseFloat(env.GIFT_AMOUNT)
export const GIFT_FEE = parseFloat(env.GIFT_FEE)

export const dbFilePath = path.resolve(__dirname, '..', 'db.json')
