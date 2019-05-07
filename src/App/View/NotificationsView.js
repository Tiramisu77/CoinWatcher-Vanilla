export class NotificationsView {
    constructor() {
        window.EE.on("showNotification", this.render, this)
    }

    render(payload) {
        let { notification, data } = payload
        if (notification.type === "price") {
            this.renderPriceNotification(notification, data)
        } else {
            this.renderPercNotification(notification, data)
        }
    }

    renderPriceNotification(priceNotif, data) {
        try {
            const lang = navigator.languages
                ? navigator.languages[0]
                : navigator.language
                ? navigator.language
                : "en-US"
            navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification(`Coin Watcher alert`, {
                    body: `${data.name} @ ${window.lib.numToFormattedString(data.price, {
                        type: "currency",
                        currency: priceNotif.currency,
                        lang,
                    })}`,
                    icon: priceNotif.targetIsHigher
                        ? "/CoinWatcher/images/green-delta.png"
                        : "/CoinWatcher/images/red-delta.png",
                    requireInteraction: true,
                })
            })
        } catch (e) {
            console.error(e)
        }
    }

    renderPercNotification(percNotif, data) {
        try {
            navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification(`Coin Watcher alert`, {
                    body: `${data.name} ${percNotif.period} change: ${
                        window.lib.numToFormattedString(data.priceChange, {
                            type: "percentage",
                            isChange: true,
                        }).str
                    } (${window.lib.numToFormattedString(data.currentPrice, {
                        type: "currency",
                        currency: percNotif.currency,
                    })})`,
                    icon:
                        data.priceChange < 0
                            ? "/CoinWatcher/images/red-delta.png"
                            : "/CoinWatcher/images/green-delta.png",
                    requireInteraction: true,
                })
            })
        } catch (e) {
            console.error(e)
        }
    }
}

// color: 00cc33
