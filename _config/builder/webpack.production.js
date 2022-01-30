const merge = require('webpack-merge');
const devSetup = require('./webpack.development');
const getAppData = require('./getAppData');

const appData = getAppData();

module.exports = merge(devSetup(false, undefined, appData), {
  mode: 'production',
  devtool: false,
  output: {
    publicPath: './',
  },
});
