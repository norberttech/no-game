module.exports = {
    context: __dirname + "/src",
    entry:   "./Engine/Bootstrap.js",
    output: {
        path: __dirname + "/game",
        filename: "game.js"
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    resolve: {
        alias: {
            UUID: dirname + 'node_modules/uuid/uuid.js',
        }
    }
};