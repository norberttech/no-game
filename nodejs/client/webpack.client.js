var webpack = require('webpack')

var ignore = new webpack.IgnorePlugin(new RegExp("\.md$"));

module.exports = {
    context: __dirname + "/src/NoGame",
    entry:   "./bootstrap.js",
    devtool: 'source-map',
    output: {
        path: __dirname + "/build",
        filename: "client.js"
    },
    mode: "production",
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
        symlinks: false,
        alias: {
            WebSocket: __dirname + '/node_modules/ws/lib/WebSocket.js'
        }
    },
    plugins: [ignore]
};