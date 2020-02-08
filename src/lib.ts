/*
Sign and submit a transaction with uns.network Blockchain

Libs:
"@uns/crypto": "^4.2.3",
"@uns/ts-sdk": "^2.2.0",


See https://gist.github.com/rigwild/d1bb28f176d011cb458499ec4490aeb1
See https://gist.github.com/rigwild/2accfce44f6261f4cca459758cce7834
*/

import { UNSClient, Network } from '@uns/ts-sdk'
import { Transactions, Identities, Managers, Interfaces } from '@uns/ark-crypto'

import { NETWORK, SECOND_PASSPHRASE, PASSPHRASE } from './config'

/** UNS client instance */
let unsClient: UNSClient

/** Fetch the latest block height */
const getLatestBlockHeight = async (): Promise<number> => {
  const chainMeta = await unsClient.blockchain.get()
  if (chainMeta.data) return chainMeta.data.block.height
  throw new Error('Could not retrieve chain metadata')
}

/**
 * Initialize the UNS client instance and the `@uns/ark-crypto` lib settings
 * Set the latest available block height to use latest features
 *
 * As the uns.network block height is too low, the ark-crypto lib doesn't accept it
 * as api version 2.
 * Probably a conflict with how the lib is handled.
 */
export const initCrypto = async () => {
  unsClient = new UNSClient()
  unsClient.init({ network: NETWORK as Network })

  Managers.configManager.setFromPreset(NETWORK as Network)
  // Managers.configManager.setHeight(await getLatestBlockHeight())
  Managers.configManager.setHeight(9999999999)
}

/** Get a wallet next transaction nonce */
const getNextNonce = async (walletAddress: string) => {
  const walletData = await unsClient.wallet.get(walletAddress)
  const nonce = (walletData.data as any).nonce
  return (parseInt(nonce, 10) + 1).toString()
}

/**
 * Build and sign a new transaction
 * @param receiverAddress Recipient wallet address
 * @param amount Amount of SUNS to send in sunstoshi (default = 0.1 SUNS = 0.1 * 1e8 sunstoshi)
 * @param fee Amount of SUNS used for the transaction fee (default = 0.01 SUNS = 0.01 * 1e8 sunstoshi)
 * @param vendorField Vendor field (SmartBridge)
 * @see https://gist.github.com/rigwild/d1bb28f176d011cb458499ec4490aeb1
 */
const signTransaction = async (
  receiverAddress: string,
  amount: string = `${0.1 * 1e8}`,
  fee: string = `${0.01 * 1e8}`,
  vendorField: string = ''
) => {
  // Get wallet's next transaction nonce
  const nextNonce = await getNextNonce(Identities.Address.fromPassphrase(PASSPHRASE))

  // Build the transaction
  let transactionToSend = Transactions.BuilderFactory.transfer()
    .recipientId(receiverAddress)
    .amount(amount)
    .fee(fee)
    .version(2)
    .nonce(nextNonce)
    .vendorField(vendorField)

  // Set the bridge chain field
  if (vendorField) transactionToSend.vendorField(vendorField)

  return transactionToSend
    .sign(PASSPHRASE)
    .secondSign(SECOND_PASSPHRASE)
    .getStruct()
}

/**
 * Submit a signed transaction to the blockchain
 * @param transaction Signed transaction
 */
const sendTransaction = (transaction: Interfaces.ITransactionData) => unsClient.transaction.send(transaction)

/**
 * Send a transaction
 * @param receiverAddress Recipient wallet address
 * @param amount Amount of SUNS to send in sunstoshi (default = 0.1 SUNS = 0.1 * 1e8 sunstoshi)
 * @param fee Amount of SUNS used for the transaction fee (default = 0.01 SUNS = 0.01 * 1e8 sunstoshi)
 * @param vendorField Vendor field (SmartBridge)
 */
export const send = async (
  receiverAddress: string,
  amount = `${0.1 * 1e8}`,
  fee = `${0.01 * 1e8}`,
  vendorField?: string
) => signTransaction(receiverAddress, amount, fee, vendorField).then(res => sendTransaction(res))

/** Get remaining tokens amount in faucet's wallet (in SUNS) */
export const getWalletTokensAmount = async () => {
  const walletData = await unsClient.wallet.get(Identities.Address.fromPassphrase(PASSPHRASE))
  if (walletData.data) return walletData.data.balance / 1e8
  return -1
}
