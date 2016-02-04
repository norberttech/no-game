var webpack = require('webpack')

var ignore = new webpack.IgnorePlugin(new RegExp("\.md$"));

module.exports = {
    context: __dirname + "/src",
    entry:   "./NoGame/Client/Client.js",
    output: {
        path: __dirname + "/bin",
        filename: "client.js"
    },
    target: "node",
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: {presets: ['es2015']}},
            { test: /\.json$/, loader: "json" }
        ]
    },
    resolve: {
        alias: {
            WebSocket: __dirname + '/node_modules/ws/lib/WebSocket.js'
        }
    },
    plugins: [ignore]
};