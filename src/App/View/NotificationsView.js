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
        const lang = navigator.languages ? navigator.languages[0] : navigator.language ? navigator.language : "en-US"
        let notification = new Notification(`Coin Watcher alert`, {
            body: `${data.name} @ ${window.lib.numToFormattedString(data.price, {
                type: "currency",
                currency: priceNotif.currency,
                lang,
            })}`,
            icon: priceNotif.targetIsHigher ? "/CoinWatcher/images/green-delta.png" : "/images/red-delta.png",
        })
        notification.onclick = () => {
            window.focus()
            notification.close()
        }
    }

    renderPercNotification(percNotif, data) {
        let notification = new Notification(`Coin Watcher alert`, {
            body: `${data.name} ${percNotif.period} change: ${
                window.lib.numToFormattedString(data.priceChange, {
                    type: "percentage",
                    isChange: true,
                }).str
            }`,
            icon: data.priceChange < 0 ? "/CoinWatcher/images/red-delta.png" : "/images/green-delta.png",
        })
        notification.onclick = () => {
            window.focus()
            notification.close()
        }
    }
}

// color: 00cc33
