import { numToFormattedString } from "./Model/helpers.js"

export const decorate = function decorate(target, wrapper) {
    return function(...args) {
        return wrapper.call(this, target, args)
    }
}

export const tryCatchWrapper = async function tryCatchWrapper(func, args) {
    try {
        return await func.call(this, ...args)
    } catch (e) {
        if (window.DEBUG) console.error(e)
    }
}

export class EventEmitter {
    constructor() {
        this.__eventRegister__ = new Map()
        this.__requestRegister__ = new Map()
    }

    on(event, handler, context = null) {
        if (typeof event !== "string") throw new Error("event must be a string")

        if (typeof handler !== "function") throw new Error("handler must be a function")

        if (this.__eventRegister__.has(event)) {
            this.__eventRegister__.get(event).push({ handler, context })
        } else {
            this.__eventRegister__.set(event, [{ handler, context }])
        }
    }

    emit(event, ...args) {
        if (this.__eventRegister__.has(event)) {
            this.__eventRegister__.get(event).forEach(e => {
                e.handler.call(e.context, ...args)
            })
        } else {
            throw new Error(`event ${event} not found`)
        }
    }

    //todo
    unsub() {}

    once() {}

    request(query, ...params) {
        if (this.__requestRegister__.has(query)) {
            let { handler, context } = this.__requestRegister__.get(query)
            return handler.call(context, ...params)
        } else {
            throw new Error(`query ${query} not found`)
        }
    }

    respond(query, handler, context = null) {
        if (typeof query !== "string") throw new Error("query must be a string")
        if (typeof handler !== "function") throw new Error("handler must be a function")
        if (typeof context !== "object") throw new Error("context must be an object")
        if (this.__requestRegister__.has(query)) {
            throw new Error("only one handler can respond to requests")
        } else {
            this.__requestRegister__.set(query, { handler, context })
        }
    }
}

const createId = function() {
    return (
        "_" +
        Math.random()
            .toString(36)
            .substr(2, 9)
    )
}

const wipeChildren = function(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild)
    }
}

const HOUR = 1000 * 60 * 60
const DAY = 24 * HOUR
const periodStrToMs = function(periodStr) {
    if (periodStr[periodStr.length - 1] === "d") {
        return parseInt(periodStr) * DAY
    }
    if (periodStr[periodStr.length - 1] === "h") {
        return parseInt(periodStr) * HOUR
    }
}

const toFixedCurrency = function(num) {
    if (num > 100) return num.toFixed(0)
    if (num > 10) return num.toFixed(2)
    if (num > 1) return num.toFixed(4)
    if (num < 1) return num.toFixed(8)
}

const lib = {
    EventEmitter,
    tryCatchWrapper,
    decorate,
    createId,
    wipeChildren,
    periodStrToMs,
    toFixedCurrency,
    numToFormattedString,
}

window.lib = lib
