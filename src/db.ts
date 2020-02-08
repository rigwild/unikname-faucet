import { GIFT_INTERVAL_DELAY_MS } from './config'

export declare interface GiftEntry {
  address: string
  amount: string
  ip: string
  timestamp: Date
}

export class Database {
  private constructor() {}

  private static giftsHistory: GiftEntry[] = []
  private static giftedTokensTotal: number = 0

  public static add(entry: GiftEntry) {
    this.giftsHistory.push(entry)
    this.giftedTokensTotal += parseInt(entry.amount, 10)
  }

  private static lastGift(address: string, ip: string) {
    const lastGifts = this.giftsHistory
      .filter(entry => entry.address === address || entry.ip === ip)
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))

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

  public static getGiftedTokensTotal() {
    return this.giftedTokensTotal
  }
}
