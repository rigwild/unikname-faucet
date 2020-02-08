import os from 'os'
import path from 'path'
import dotenvSafe from 'dotenv-safe'

// Load environment configuration
dotenvSafe.config({
  path: path.resolve(__dirname, '..', '.env'),
  example: path.resolve(__dirname, '..', '.env.example')
})

export const { NETWORK, PASSPHRASE, SECOND_PASSPHRASE, GIFT_VENDORFIELD, GIFT_AMOUNT, GIFT_FEE } = process.env as {
  [key: string]: string
}

export const { SERVER_PORT, GIFT_INTERVAL_DELAY_MS } = (process.env as unknown) as { [key: string]: number }

export const isWindows = os.platform() === 'win32'
export const unsExecutable = path.resolve(__dirname, '..', 'node_modules', '.bin', isWindows ? 'uns.cmd' : 'uns')

export const dbFilePath = path.resolve(__dirname, '..', 'db.json')
