import fs from 'fs-extra'
import { GIFT_INTERVAL_DELAY_MS, dbFilePath } from './config'

export declare interface GiftEntry {
  address: string
  amount: number
  ip: string
  timestamp: Date
}

class Database {
  private isReady = false

  private giftsHistory: GiftEntry[] = []
  private giftedTokensTotal: number = 0

  /** Initialize the database, mandatory */
  public async init() {
    await this.loadDb()
    this.isReady = true
  }

  /** Load the database from file */
  private async loadDb() {
    // Check if file exists
    if (!(await fs.pathExists(dbFilePath)))
      await fs.writeJSON(dbFilePath, { giftsHistory: [], giftedTokensTotal: 0 }, { spaces: 2 })

    const content = await fs.readJSON(dbFilePath)
    this.giftsHistory = content.giftsHistory.map((x: GiftEntry) => {
      x.timestamp = new Date(x.timestamp)
      return x
    })
    this.giftedTokensTotal = content.giftedTokensTotal
  }

  /** Save the database to file */
  private saveDb() {
    if (!this.isReady) throw new Error('You must initialize the database.')

    const { giftsHistory, giftedTokensTotal } = this
    return fs.writeJSON(dbFilePath, { giftsHistory, giftedTokensTotal }, { spaces: 2 })
  }

  /** Remove old gifts from database (for privacy) */
  public async cleanDbHistory() {
    if (!this.isReady) throw new Error('You must initialize the database.')

    // Keep only items not older than the wait delay
    this.giftsHistory = this.giftsHistory.filter(
      x => x.timestamp.getTime() > Date.now() - GIFT_INTERVAL_DELAY_MS
    )
    return this.saveDb()
  }

  /**
   * Add a gift entry
   * @param entry Gift entry
   */
  public add(entry: GiftEntry) {
    if (!this.isReady) throw new Error('You must initialize the database.')

    this.giftsHistory.push(entry)
    this.giftedTokensTotal += entry.amount
    return this.saveDb()
  }

  /**
   * Return the latest gift entry for an address or ip
   * @param address Wallet address
   * @param ip IP address
   */
  private lastGift(address: string, ip: string) {
    if (!this.isReady) throw new Error('You must initialize the database.')

    const lastGifts = this.giftsHistory
      .filter(entry => entry.address === address || entry.ip === ip)
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))

    // Never received a gift
    if (lastGifts.length === 0) return null

    // Received at least one gift
    return lastGifts[0]
  }

  /**
   * Check a gift can be sent to an address or ip
   * @param address Wallet address
   * @param ip IP address
   */
  public isGiftable(address: string, ip: string) {
    if (!this.isReady) throw new Error('You must initialize the database.')

    const lastGift = this.lastGift(address, ip)
    if (!lastGift) return true
    return lastGift.timestamp.getTime() < Date.now() - GIFT_INTERVAL_DELAY_MS
  }

  /** Get the total amount of tokens gifted */
  public getGiftedTokensTotal() {
    if (!this.isReady) throw new Error('You must initialize the database.')

    return this.giftedTokensTotal
  }
}

export default new Database()
