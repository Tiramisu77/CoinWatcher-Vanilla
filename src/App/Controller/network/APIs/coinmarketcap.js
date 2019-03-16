import { loadAndTransform } from "../loaderHelpers.js"

const coinmarketcapFetcher = async () =>
    fetch("https://api.coinmarketcap.com/v1/ticker/?limit=0").then(response => {
        if (response.ok) return response.json()
        else return Promise.reject(response.status)
    })

export const loadFromCoinmarketcap = async function() {
    return loadAndTransform(coinmarketcapFetcher, x => x, () => {})
}
