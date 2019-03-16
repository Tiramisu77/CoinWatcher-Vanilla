## Coin Watcher

Coin Watcher is a free, open source and privacy-oriented cryptocurrency portfolio web app.
It stores all user data strictly on client side utilizing window.localStorage, while market data is fetched from public API's.

### Using

Visit [the official page](https://tiramisu77.github.io/CoinWatcher/) or build and run locally.

### Installation

Clone this repo and then run

`npm install`

and then

`npm run dev-build`

or

`npm run build`

After this you can go to `dist` directory and open `index.html` in your browser to run the app with `file://` protocol, or run any available server tool to serve it locally, for example with `npx serve`

### Credits

This app uses cryptocurrency market data provided by the following public API's:

-   [CoinGecko](https://www.coingecko.com/api)

-   [Alternative.me](https://alternative.me/crypto/api/)

-   [Coinmarketcap](https://api.coinmarketcap.com)
