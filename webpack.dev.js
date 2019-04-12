/* eslint-disable */
const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const { GenerateSW } = require("workbox-webpack-plugin")

module.exports = {
    entry: "./src/index.js",
    watch: true,
    watchOptions: {
        aggregateTimeout: 1300,
        ignored: /node_modules/,
    },
    plugins: [
        new CopyPlugin([
            { from: "./public/images", to: "images" },
            { from: "./public/index.html", to: "" },
            { from: "./public/push-notification.js", to: "" },
            { from: "./public/manifest.json", to: "" },
        ]),
        new GenerateSW({
            importWorkboxFrom: "local",
            skipWaiting: true,
            importScripts: ["./push-notification.js"],
            runtimeCaching: [
                {
                    urlPattern: /https:\/\/api.coingecko.com\/api\/v3\/coins\/list|https:\/\/api.coingecko.com\/api\/v3\/simple\/supported_vs_currencies/,
                    handler: "CacheFirst",
                    options: {
                        cacheName: "coinwatcher-coingecko-v3-lists",

                        expiration: {
                            maxAgeSeconds: 60 * 60 * 24 * 6,
                        },

                        cacheableResponse: {
                            statuses: [0, 200],
                        },
                    },
                },
                {
                    urlPattern: new RegExp("(https://api.coingecko.com/api/v3/coins/)(?!list)"),
                    handler: "NetworkFirst",
                    options: {
                        cacheName: "coinwatcher-coingecko-v3-coins",

                        cacheableResponse: {
                            statuses: [0, 200],
                        },
                    },
                },
            ],
        }),
    ],
    mode: "development",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
}
