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

    //unsub(event, handler, context) {}

    once() {}

    emit(event, data) {
        if (this.__eventRegister__.has(event)) {
            this.__eventRegister__.get(event).forEach(e => {
                e.handler.call(e.context, data)
            })
        } else {
            throw new Error(`event ${event} not found`)
        }
    }
}
