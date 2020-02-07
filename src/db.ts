import { GIFT_INTERVAL_DELAY_MS } from './config'

export declare interface GiftEntry {
  address: string
  amount: number
  ip: string
  timestamp: Date
}

export class Database {
  private constructor() { }

  private static db: GiftEntry[] = []

  public static add(entry: GiftEntry) {
    this.db.push(entry)
  }

  public static lastGift(address: string, ip: string) {
    const lastGifts = this.db
      .filter(entry => entry.address === address || entry.ip === ip)
      .sort((a, b) => a.timestamp < b.timestamp ? 1 : -1)

    // Never received a gift
    if (lastGifts.length === 0) return null

    // Received at least one gift
    return lastGifts[0]
  }

  public static isGiftable(address: string, ip: string) {
    const lastGift = Database.lastGift(address, ip)
    if (!lastGift) return true
    return lastGift.timestamp.valueOf() < Date.now() - GIFT_INTERVAL_DELAY_MS
  }
}
