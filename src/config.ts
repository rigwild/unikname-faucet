import os from 'os'
import path from 'path'
import dotenvSafe from 'dotenv-safe'

// Load environment configuration
dotenvSafe.config({
  path: path.resolve(__dirname, '..', '.env'),
  example: path.resolve(__dirname, '..', '.env.example')
})

const env = process.env as { [key: string]: string }
export const { NETWORK, PASSPHRASE, SECOND_PASSPHRASE, GIFT_VENDORFIELD } = env
export const SERVER_PORT = parseInt(env.SERVER_PORT, 10)
export const GIFT_INTERVAL_DELAY_MS = parseInt(env.GIFT_INTERVAL_DELAY_MS, 10)
export const GIFT_AMOUNT = parseInt(env.GIFT_AMOUNT, 10)
export const GIFT_FEE = parseInt(env.GIFT_FEE, 10)

export const isWindows = os.platform() === 'win32'
export const unsExecutable = path.resolve(__dirname, '..', 'node_modules', '.bin', isWindows ? 'uns.cmd' : 'uns')

export const dbFilePath = path.resolve(__dirname, '..', 'db.json')
