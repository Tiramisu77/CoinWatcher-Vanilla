let timer = null
const loop = async function(interval) {
    setTimeout(loop, interval, interval)
    postMessage("tick")
}

onmessage = function(e) {
    if (e.data.msg === "start") {
        let { interval } = e.data
        if (typeof interval !== "number" || isNaN(interval) || interval < 1000 * 60) {
            throw new Error("illegal interval value")
        }
        loop(e.data.interval)
    }
    if (e.data.msg === "stop") {
        clearInterval(timer)
    }
}
