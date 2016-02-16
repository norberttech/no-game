var webpack = require('webpack')

var ignore = new webpack.IgnorePlugin(new RegExp("\.md$"));

module.exports = {
    context: __dirname + "/src/NoGame/Client",
    entry:   "./bootstrap.js",
    output: {
        path: __dirname + "/bin",
        filename: "client.js"
    },
    target: "web",
    node: {
        tls: "empty",
        fs: "empty"
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: "html" },
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