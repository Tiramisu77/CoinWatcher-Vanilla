const isNonEmptyStr = function(str) {
    return typeof str === "string" ? (str.length > 0 ? true : false) : false
}

export const validate = function(item) {
    let { id, name, image, market_data } = item
    let res =
        isNonEmptyStr(id) &&
        isNonEmptyStr(name) &&
        (isNonEmptyStr(image) || image === undefined) &&
        typeof market_data === "object"

    if (res === false) {
        throw new Error("malformed coin data")
    }
    return item
}

export const validateListItem = function(listItem) {
    let { id, symbol, name } = listItem
    let res = isNonEmptyStr(id) && isNonEmptyStr(symbol) && isNonEmptyStr(name)
    if (res === false) {
        if (window.DEBUG) console.warn(`Malformed coinList data @ ${listItem}`)
        return null
    }
    return listItem
}
