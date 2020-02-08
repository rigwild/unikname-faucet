# UNS Faucet
A faucet to gift SUNS tokens to [uns.network](https://www.uns.network/) users 🤑💸.

## Faucet link
[uns-faucet.rigwild.dev](https://uns-faucet.rigwild.dev)

## Screenshot
![App screenshot](screenshot.jpg)

## Install
```sh
git clone https://github.com/rigwild/uns-faucet
cd uns-faucet
yarn
```

## Build
```sh
yarn build
```

## Configuration
Copy [`.env.example`](`.env.example`) to `.env`.

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `SERVER_PORT` | HTTP port the server will listen | `8080` |
| `GIFT_INTERVAL_DELAY_MS` | Delay a user must wait before asking for another gift in ms | `604800000` (1 week) |
| `GIFT_AMOUNT` | Gift amount in SUNS | `35` (35 SUNS) |
| `GIFT_FEE` | Gift amount in SUNS | `0.1` (0.1 SUNS) |
| `GIFT_VENDORFIELD` | Message set in the Smartbridge field | `'Faucet money 🤑💸'` |
| `NETWORK` | The [uns.network](https://www.uns.network/) to operate on | `'sandbox'` |
| `PASSPHRASE` | Wallet passphrase | `'suns faucet wallet main passphrase'` |
| `SECOND_PASSPHRASE` | Second wallet passphrase | `'suns faucet wallet second passphrase'` |

## Start
```sh
yarn start
```

## License
[The MIT License](./LICENSE).
