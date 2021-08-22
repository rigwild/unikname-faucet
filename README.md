# Unikname Faucet

A faucet to gift SUNIK tokens to [unikname.network](https://www.unikname.network/) users 🤑💸.

## Faucet link

[unikname-faucet.rigwild.dev](https://unikname-faucet.rigwild.dev)

## Screenshot

![App screenshot](screenshot.jpg)

## Install

```sh
git clone https://github.com/rigwild/unikname-faucet
cd unikname-faucet
yarn
```

## Build

```sh
yarn build
```

## Configuration

Copy [`.env.example`](`.env.example`) to `.env`.

| Variable                    | Description                                                         | Example                                      |
| --------------------------- | ------------------------------------------------------------------- | -------------------------------------------- |
| `SERVER_PORT`               | HTTP port the server will listen                                    | `8080`                                       |
| `DATABASE_CLEANUP_CRONTIME` | Interval between database cleanups                                  | `''0 * * * *'` (1 every hours)               |
| `GIFT_INTERVAL_DELAY_MS`    | Delay a user must wait before asking for another gift in ms         | `604800000` (1 week)                         |
| `GIFT_AMOUNT`               | Gift amount in SUNIK                                                | `100` (100 SUNIK)                            |
| `GIFT_FEE`                  | Gift transaction fee in SUNIK                                       | `1` (1 SUNIK)                                |
| `GIFT_VENDORFIELD`          | Message set in the Smartbridge field                                | `'Faucet money 🤑💸'`                        |
| `NETWORK`                   | The [unikname.network](https://www.unikname.network/) to operate on | `'sandbox'`                                  |
| `PASSPHRASE`                | Wallet passphrase                                                   | `'unikname faucet wallet main passphrase'`   |
| `SECOND_PASSPHRASE`         | Second wallet passphrase                                            | `'unikname faucet wallet second passphrase'` |

## Start

```sh
yarn start
```

## Note

To limit abuses, you can ask for tokens once per week. You wallet address and IP address are saved for a duration of 1 week then automatically removed from the database.

## License

[The MIT License](./LICENSE).
