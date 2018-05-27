const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const ExtractCssChunks = require('../extract-css-chunks-webpack-plugin')

const res = p => path.resolve(__dirname, p)

// if you're specifying externals to leave unbundled, you need to tell Webpack
// to still bundle `react-universal-component`, `webpack-flush-chunks` and
// `require-universal-module` so that they know they are running
// within Webpack and can properly make connections to client modules:
const externals = fs
.readdirSync(res('../node_modules'))
.filter(x =>
  !/\.bin|react-universal-component|require-universal-module|webpack-flush-chunks/.test(x))
.reduce((externals, mod) => {
  externals[mod] = `commonjs ${mod}`
  return externals
}, {})

module.exports = {
  mode: 'production',
  name: 'server',
  target: 'node',
  devtool: 'source-map',
  entry: ['@babel/polyfill',
          'fetch-everywhere',res('../server/render.js')],
  externals,
  output: {
    path: res('../buildServer'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: false,
            babelrc: true
          }
        }
      },
      /*  {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: {
            loader: 'css-loader/locals',
            options: {
              modules: false
            }
          }
        },*/
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: {
          loader: 'css-loader/locals',
          options: {
            modules: true,
            localIdentName: '[name]__[local]--[hash:base64:5]'
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.css']
  },
  optimization: {
    //runtimeChunk:true,
    //splitChunks: {},
    minimize: false
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ]
}
