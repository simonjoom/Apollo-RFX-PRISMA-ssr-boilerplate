const path = require('path')
const webpack = require('webpack')
const ExtractCssChunks = require('../extract-css-chunks-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')
//const AutoDllPlugin = require('autodll-webpack-plugin')
module.exports = {
  mode: 'production',
  name: 'client',
  target: 'web',
  devtool: 'source-map',
  entry: ['@babel/polyfill',
          'fetch-everywhere',path.resolve(__dirname, '../src/index.js')],
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    path: path.resolve(__dirname, '../buildClient'),
    publicPath: '/static/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use:{
          loader: 'babel-loader',
          options: {
            cacheDirectory: false,
            babelrc: true
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractCssChunks.extract({
          use: {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          }
        })
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.css']
  },
  optimization: {
    runtimeChunk:true,
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        /*styles: {
          name: 'bundles/pages/_app.js.css',
          test: /\.(sc|c)ss$/,
          chunks: 'all',
          reuseExistingChunk: true
        },
        main: {
          name: 'main',
          chunks: 'all',
          enforce: false,
          test: /App|main/,
          reuseExistingChunk: true
        },*/
        commons: {
          test: /(node_modules\/(?!webpack-hot).*\.js)/,
          name: 'vendors',
          chunks: 'all',
          enforce: false,
          reuseExistingChunk: false
        }
      }},
    minimize: false
  },
  plugins: [
    new StatsPlugin('stats.json'),
    new ExtractCssChunks(),
    /*new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: '[name].[chunkhash].js',
      minChunks: Infinity
    }),*/
    
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    /* new webpack.optimize.UglifyJsPlugin({
       compress: {
         screw_ie8: true,
         warnings: false
       },
       mangle: {
         screw_ie8: true
       },
       output: {
         screw_ie8: true,
         comments: false
       },
       sourceMap: true
     }),*/
    new webpack.HashedModuleIdsPlugin()
    /*  new AutoDllPlugin({
        context: path.join(__dirname, '..'),
        filename: '[name].js',
        entry: {
          vendor: [
            'react',
            'react-dom',
            'react-redux',
            'redux',
            'history/createBrowserHistory',
            'transition-group',
            'redux-first-router',
            'redux-first-router-link',
            'babel-polyfill',
            'redux-devtools-extension/logOnlyInProduction'
          ]
        }
      })*/
  ]
}
