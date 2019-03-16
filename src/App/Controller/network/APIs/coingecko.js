import { loadAndTransform, validate, validateListItem } from "../loaderHelpers.js"

const coingeckoAdapter = function(coingeckoItem, priceOfBitcoin) {
    const a = coingeckoItem
    const res = {}
    res.id = a.id
    res.symbol = a.symbol.toUpperCase()
    res.name = a.name
    res.image = a.image
    res.price_usd = a.current_price.toString()
    res.price_btc = (a.current_price / priceOfBitcoin).toString()
    res.market_cap_usd = a.market_cap.toString()
    res.percent_change_1h = a.price_change_percentage_1h_in_currency.toString()
    res.percent_change_7d = a.price_change_percentage_7d_in_currency.toString()
    res.percent_change_24h = a.price_change_percentage_24h.toString()

    return res
}

const findBTCpriceInGecko = function(geckoData) {
    return geckoData.find(item => item.id === "bitcoin").current_price
}

const geckoFetcher = async () => {
    return await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d"
    ).then(response => {
        if (response.ok) return response.json()
        else return Promise.reject(response.status)
    })
}

export const loadFromCoingecko = async function() {
    return loadAndTransform(geckoFetcher, coingeckoAdapter, findBTCpriceInGecko)
}

const geckoFetcherSingle = async id => {
    //throttle for testing
    //await new Promise(r => setTimeout(r, Math.random() * 15000))

    return fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    ).then(response => {
        if (response.ok) return response.json()
        else return Promise.reject(response.status)
    })
}

const coingeckoAdapterSingle = function(coingeckoItemSingle) {
    const a = coingeckoItemSingle
    const res = {}
    res.id = a.id
    res.symbol = a.symbol.toUpperCase()
    res.name = a.name
    res.image = a.image.small
    res.price_usd = a.market_data.current_price.usd.toString()
    res.price_btc = a.market_data.current_price.btc.toString()
    res.market_cap_usd = a.market_data.market_cap.usd.toString()
    try {
        res.percent_change_1h = a.market_data.price_change_percentage_1h_in_currency.usd.toString()
    } catch (e) {
        res.percent_change_1h = "0"
    }

    res.percent_change_7d = a.market_data.price_change_percentage_7d
        ? a.market_data.price_change_percentage_7d.toString()
        : "0"
    res.percent_change_24h = a.market_data.price_change_percentage_24h
        ? a.market_data.price_change_percentage_24h.toString()
        : "0"
    return res
}

export const loadFromCoingeckoSingle = function(id) {
    return geckoFetcherSingle(id)
        .then(coingeckoAdapterSingle)
        .then(validate)
}

export const loadSupportedCoinsCoingecko = async function() {
    try {
        let res = await fetch(`https://api.coingecko.com/api/v3/coins/list`).then(response => {
            if (response.ok) return response.json()
            else return Promise.reject(response.status)
        })

        let data = res.reduce((acc, item) => {
            try {
                acc[item.symbol.toUpperCase()] = validateListItem(item)
                return acc
            } catch (e) {
                //
            }
        }, {})

        return {
            coingecko: data,
        }
    } catch (error) {
        if (window.DEBUG) console.error(error)
        return "not ok"
    }
}
