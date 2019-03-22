const isNonEmptyStr = function(str) {
    return typeof str === "string" ? (str.length > 0 ? true : false) : false
}

export const validate = function(transformed) {
    let a = transformed
    let res = true
    res = isNonEmptyStr(a.id)
    res = isNonEmptyStr(a.name)
    res = isNonEmptyStr(a.image) || typeof a.image === "undefined"
    res = typeof a.market_data === "object" ? true : false
    if (res === false) {
        throw new Error("malformed coin data")
    }
    return a
}

export const validateListItem = function(listItem) {
    let a = listItem
    let res = true
    res = isNonEmptyStr(a.id)
    res = isNonEmptyStr(a.symbol)
    res = isNonEmptyStr(a.name)
    if (res === false) {
        if (window.DEBUG) console.warn(`Malformed coinList data @ ${a}`)
        return null
    }
    return a
}

const MAX_ERROR_COUNT = 25

export const loadAndTransform = async function(fetcher, adapter, findBTCprice) {
    const result = {}

    const data = await fetcher()

    let errorCount = 0
    const priceOfBitcoin = findBTCprice(data)

    for (const item of data) {
        try {
            const transformed = adapter(item, priceOfBitcoin)
            validate(transformed)
            result[transformed.symbol] = transformed
        } catch (error) {
            errorCount += 1
            if (errorCount > MAX_ERROR_COUNT) throw new Error(`bad data`)
        }
    }
    return result
}

/*
Promise.any by https://github.com/m0ppers/promise-any
*/
function reverse(promise) {
    return new Promise((resolve, reject) => Promise.resolve(promise).then(reject, resolve))
}

function promiseAny(iterable) {
    return reverse(Promise.all([...iterable].map(reverse)))
}

let usePromiseAny = false
const MAX_ACCEPTABLE_DELAY = 4000

/*
 *This function tries to call asynchronous functions one after another
 *until one of them succeeds (meaning doesn't throw an error).
 *@param {Array} arrOfAsyncFuncs - array of asynchronous functions to be called
 *@return - the return value of the first succesful asynchronous function
 *@throw - {Error} - indicated that all calls have failed
 */

export const asyncShorCircuit = async function(arrOfAsyncFuncs) {
    if (usePromiseAny) {
        return promiseAny(arrOfAsyncFuncs.map(e => e()))
    }
    for (let func of arrOfAsyncFuncs) {
        try {
            let t1 = Date.now()
            let res = await func()
            let t2 = Date.now()
            if (t2 - t1 > MAX_ACCEPTABLE_DELAY && !usePromiseAny) usePromiseAny = true
            return res
        } catch (e) {
            if (window.DEBUG) console.error(e)
        }
    }
    throw new Error("all failed")
}

//experimental code

/*

response => {
  if (response.ok)return response.json()
  else return Promise.reject(response.status)
}

function reverse(promise) {
    return new Promise((resolve, reject) => Promise.resolve(promise).then(reject, resolve))
}

function promiseAny(iterable) {
    return reverse(Promise.all([...iterable].map(reverse)))
}

async function delay(f, d) {
    if (!f) return Promise.reject("")
    await new Promise(r => setTimeout(r, d))
    return f()
}
export const asyncShorCircuit = async function(arrOfAsyncFuncs) {
    for (let i = 0; i < arrOfAsyncFuncs.length; i++) {
        try {
            return await promiseAny([arrOfAsyncFuncs[i](), delay(arrOfAsyncFuncs[i + 1], 3000)])
        } catch (e) {
            //
        }
    }}


*/
