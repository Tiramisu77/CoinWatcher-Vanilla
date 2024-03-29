const SATOSHIS_IN_BTC = 100000000
const MBTC_IN_BTC = 1000

const autoConvert = function(btcNum) {
    if (typeof btcNum !== "number" || isNaN(btcNum)) {
        throw new Error("btc converter expected a number, instead got: " + btcNum)
    }
    if (Math.abs(btcNum) < 0.0001 && btcNum !== 0) {
        let num = btcNum * SATOSHIS_IN_BTC
        let str = parseFloat(num.toPrecision(4)).toString()
        let unit = "sat"
        let combinedStrLeft = unit + " " + str
        let combinedStrRight = str + " " + unit
        return {
            num,
            str,
            unit,
            combinedStrLeft,
            combinedStrRight,
        }
    }

    if (Math.abs(btcNum) < 1 && btcNum !== 0) {
        let num = btcNum * MBTC_IN_BTC
        let str = parseFloat(num.toFixed(3)).toString()
        let unit = "mBTC"
        let combinedStrLeft = unit + " " + str
        let combinedStrRight = str + " " + unit
        return {
            num,
            str,
            unit,
            combinedStrLeft,
            combinedStrRight,
        }
    }

    let num = btcNum
    let str = parseFloat(btcNum.toFixed(3)).toString()
    let unit = "BTC"
    let combinedStrLeft = unit + " " + str
    let combinedStrRight = str + " " + unit
    return {
        num,
        str,
        unit,
        combinedStrLeft,
        combinedStrRight,
    }
}

export const prependPlus = function(val, str) {
    if (val >= 0) {
        str = "+" + str
    }
    return str
}

const determineColor = function(val) {
    return val >= 0 ? "green" : "red"
}

export const numToFormattedString = function(num, options) {
    let str
    let color = null
    if (options.type === "percentage") {
        str = num.toFixed(2) + "%"
    }
    if (options.type === "currency") {
        if (options.currency === "BTC") {
            str = autoConvert(num).combinedStrRight
        } else {
            str =
                num > 1
                    ? num.toLocaleString(options.lang, {
                          style: "currency",
                          currency: options.currency,
                          maximumFractionDigits: options.digits, // when undefined, it will use default value of the currency
                          minimumFractionDigits: options.digits, // together it emulates .toFixed()
                      })
                    : num.toLocaleString(options.lang, {
                          style: "currency",
                          currency: options.currency,
                          maximumSignificantDigits: 3,
                      })
        }
    }

    if (options.isChange) {
        str = prependPlus(num, str)
        color = determineColor(num)
    }

    if (color !== null) {
        return { str, color }
    } else return str
}
