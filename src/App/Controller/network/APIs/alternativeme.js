import { loadAndTransform, validate, validateListItem } from "../loaderHelpers.js"
const alternativeMeAdapter = function(alternativemeItem, priceOfBitcoin) {
    const a = alternativemeItem
    const res = {}
    res.id = a.website_slug
    res.symbol = a.symbol
    res.name = a.name
    res.image = undefined
    res.price_usd = a.quotes.USD.price.toString()
    res.price_btc = (a.quotes.USD.price / priceOfBitcoin).toString()
    res.market_cap_usd = a.quotes.USD.market_cap.toString()
    res.percent_change_1h = a.quotes.USD.percentage_change_1h.toString()
    res.percent_change_24h = a.quotes.USD.percentage_change_24h.toString()
    res.percent_change_7d = a.quotes.USD.percentage_change_7d.toString()

    return res
}

const getPriceOfBitcoin = function(altData) {
    return altData.find(item => item.name === "Bitcoin").quotes.USD.price
}

const altMeFetcehr = async () => {
    const data = await fetch(
        "https://cors-anywhere.herokuapp.com/https://api.alternative.me/v2/ticker/?structure=array&limit=250"
    ).then(response => {
        if (response.ok) return response.json()
        else return Promise.reject(response.status)
    })
    return data.data
}

export const loadFromAlternativeMe = async function() {
    return loadAndTransform(altMeFetcehr, alternativeMeAdapter, getPriceOfBitcoin)
}

const alternativemeFetcherSingle = id => {
    return fetch(`https://cors-anywhere.herokuapp.com/https://api.alternative.me/v1/ticker/${id}/`)
        .then(response => {
            if (response.ok) return response.json()
            else return Promise.reject(response.status)
        })
        .then(r => r[0])
}

const alternativemeAdapterSingle = function(alternativemeItem) {
    const a = alternativemeItem
    const res = {}
    res.id = a.id
    res.symbol = a.symbol.toUpperCase()
    res.name = a.name
    res.image = null
    res.price_usd = a.price_usd.toString()
    res.price_btc = a.price_btc.toString()
    res.market_cap_usd = a.market_cap_usd.toString()
    res.percent_change_1h = a.percent_change_1h.toString()
    res.percent_change_7d = a.percent_change_24h.toString()
    res.percent_change_24h = a.percent_change_7d.toString()
    return res
}

export const loadFromAlternativemeSingle = function(id) {
    return alternativemeFetcherSingle(id)
        .then(alternativemeAdapterSingle)
        .then(validate)
}

const listAdapter = function(listItem) {
    let res = {}
    res.id = listItem.website_slug
    res.symbol = listItem.symbol
    res.name = listItem.name
    return res
}

export const loadSupportedCoinsAlternativeme = async function() {
    try {
        let res = await fetch(`https://cors-anywhere.herokuapp.com/https://api.alternative.me/v2/listings/`)
            .then(response => {
                if (response.ok) return response.json()
                else return Promise.reject(response.status)
            })
            .then(r => r.data)

        return {
            alternativeme: res.reduce((acc, item) => {
                try {
                    acc[item.symbol.toUpperCase()] = validateListItem(listAdapter(item))
                } catch (error) {
                    //
                }
                return acc
            }, {}),
        }
    } catch (error) {
        if (window.DEBUG) console.error(error)
        return "not ok"
    }
}
