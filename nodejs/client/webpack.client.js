var webpack = require('webpack')

var ignore = new webpack.IgnorePlugin(new RegExp("\.md$"));

module.exports = {
    context: __dirname + "/src/NoGame/Client",
    entry:   "./bootstrap.js",
    output: {
        path: __dirname + "/build",
        filename: "client.js"
    },
    target: "web",
    node: {
        tls: "empty",
        fs: "empty"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    resolve: {
        alias: {
            WebSocket: __dirname + '/node_modules/ws/lib/WebSocket.js'
        }
    },
    plugins: [ignore]
};