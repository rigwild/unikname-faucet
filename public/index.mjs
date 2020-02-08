import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.0/dist/vue.esm.browser.js'

new Vue({
  data() {
    return {
      walletAddress: '',
      remainingTokens: 0,
      giftedTokensTotal: 0,

      logs: '',
      loading: false
    }
  },
  async mounted() {
    await this.loadRemainingTokensAmount()
    await this.loadGiftedTokensTotal()

    // Refresh every 30s
    setInterval(() => {
      this.loadRemainingTokensAmount()
      this.loadGiftedTokensTotal()
    }, 30000)
  },
  methods: {
    async sendTokens() {
      try {
        this.loading = true
        this.logs = ''
        const res = await fetch(`/gift?walletAddress=${this.walletAddress}`, { method: 'POST' }).then(res => res.json())
        this.logs = JSON.stringify(res, null, 2)
      } catch (error) {
        this.logs = error.message
      } finally {
        this.loading = false
      }

      // Reload remaining tokens amount
      await this.loadRemainingTokensAmount()
    },

    async loadRemainingTokensAmount() {
      const res = await fetch('/tokensLeft').then(res => res.json())
      this.remainingTokens = res.data
    },
    async loadGiftedTokensTotal() {
      const res = await fetch('/giftedTokensTotal').then(res => res.json())
      this.giftedTokensTotal = res.data
    }
  }
}).$mount('#app')
