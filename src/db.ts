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

  public async init() {
    await this.loadDb()
    this.isReady = true
  }

  private async loadDb() {
    // Check if file exists
    if (!(await fs.pathExists(dbFilePath)))
      await fs.writeJSON(dbFilePath, { giftsHistory: [], giftedTokensTotal: 0 }, { spaces: 2 })

    const content = await fs.readJSON(dbFilePath)
    this.giftsHistory = content.giftsHistory
    this.giftedTokensTotal = content.giftedTokensTotal
  }

  private saveDb() {
    if (!this.isReady) throw new Error('You must initialize the database.')

    const { giftsHistory, giftedTokensTotal } = this
    return fs.writeJSON(dbFilePath, { giftsHistory, giftedTokensTotal }, { spaces: 2 })
  }

  public add(entry: GiftEntry) {
    if (!this.isReady) throw new Error('You must initialize the database.')

    this.giftsHistory.push(entry)
    this.giftedTokensTotal += entry.amount
    return this.saveDb()
  }

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

  public isGiftable(address: string, ip: string) {
    if (!this.isReady) throw new Error('You must initialize the database.')

    const lastGift = this.lastGift(address, ip)
    if (!lastGift) return true
    return lastGift.timestamp.valueOf() < Date.now() - GIFT_INTERVAL_DELAY_MS
  }

  public getGiftedTokensTotal() {
    if (!this.isReady) throw new Error('You must initialize the database.')

    return this.giftedTokensTotal
  }
}

export default new Database()
