import os from 'os'
import path from 'path'
import dotenvSafe from 'dotenv-safe'

// Load environment configuration
dotenvSafe.config({
  path: path.resolve(__dirname, '..', '.env'),
  example: path.resolve(__dirname, '..', '.env.example')
})

export const {
  NETWORK,
  PASSPHRASE,
  SECOND_PASSPHRASE
} = process.env as { [key: string]: string }

export const {
  SERVER_PORT,
  GIFT_INTERVAL_DELAY_MS,
  GIFT_AMOUNT
} = process.env as unknown as { [key: string]: number }

export const isWindows = os.platform() === 'win32'
export const unsExecutable = path.resolve(__dirname, '..', 'node_modules', '.bin', isWindows ? 'uns.cmd' : 'uns')
