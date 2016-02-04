module.exports = {
    context: __dirname + "/src",
    entry:   "./NoGame/Client/Client.js",
    output: {
        path: __dirname + "/bin",
        filename: "client.js"
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
            UUID: __dirname + '/node_modules/uuid/uuid.js',
        }
    }
};