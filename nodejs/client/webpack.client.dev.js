var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.client');
let fs = require('fs');

config.mode = 'development';

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    quiet: false,
    noInfo: false,
    https: true,
    public: 'client.nogame.local',
    key: fs.readFileSync('/etc/ssl/nogame.local.key', 'utf8'),
    cert: fs.readFileSync('/etc/ssl/nogame.local.crt', 'utf8'),
    historyApiFallback: true,
    disableHostCheck: true,
    watchOptions: {
        poll: true
    }
}).listen(3003, '0.0.0.0', function (err, result) {
    if (err) {
        console.log(err);
    }

    console.log('Listening at https://0.0.0.0:3003');
});