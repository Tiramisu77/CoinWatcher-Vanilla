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
            { from: "./public/manifest.json", to: "" },
        ]),
        new GenerateSW({
            importWorkboxFrom: "local",
            skipWaiting: true,
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
