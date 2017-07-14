const path = require('path')
const webpack = require('webpack')

const config = require('./src/config.js')

const environnementVars = {
  NODE_ENV: JSON.stringify('development'),
  SLACK_BOT_TOKEN: JSON.stringify(config.BOT_TOKEN),
}

module.exports = {
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
        test: /\.json$/,
        use: [
          'json-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          "babel-loader"
        ]
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      'node_modules'
    ],
    extensions: ['.js']
  },
  externals: ['ws'],
  plugins: [
    new webpack.DefinePlugin(environnementVars)
  ]
}
