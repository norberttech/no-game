var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.client');

config.mode = 'development';

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    quiet: false,
    noInfo: false,
    historyApiFallback: true,
    disableHostCheck: true,
    watchOptions: {
        poll: true
    }
}).listen(3003);