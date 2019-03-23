import { validate, validateListItem } from "../loaderHelpers.js"

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
    res.market_data = a.market_data
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
        res = res.map(validateListItem).filter(e => e !== null)
        return res
    } catch (error) {
        if (window.DEBUG) console.error(error)
        return "not ok"
    }
}

export const loadVersusCurrenciesCoingecko = async function() {
    return fetch(`https://api.coingecko.com/api/v3/simple/supported_vs_currencies`).then(response => {
        if (response.ok) return response.json()
        else return Promise.reject(response.status)
    })
}
