module.exports = {
    context: __dirname + "/src",
    entry:   "./NoGame/Server/bootstrap.js",
    output: {
        path: __dirname + "/bin",
        filename: "server.js"
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