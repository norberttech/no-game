var webpack = require('webpack')

var ignore = new webpack.IgnorePlugin(new RegExp("\.md$"));

module.exports = {
    context: __dirname + "/src",
    entry:   "./NoGame/Server/bootstrap.js",
    output: {
        path: __dirname + "/bin",
        filename: "server.js"
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
            UUID: __dirname + '/node_modules/uuid/uuid.js',
            WebSocketServer: __dirname + '/node_modules/ws/lib/WebSocketServer.js'
        }
    },
    plugins: [ignore]
};