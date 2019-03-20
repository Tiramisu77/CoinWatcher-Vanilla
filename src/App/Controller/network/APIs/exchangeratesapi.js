//todo validate response
export const loadFromExchangeRatesApi = function() {
    return fetch(`https://api.exchangeratesapi.io/latest?base=USD`).then(response => {
        if (response.ok) return response.json()
        else return Promise.reject(response.status)
    })
}
