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
