const path = require('path')
const webpack = require('webpack')
const AutoDllPlugin = require("../autodll-webpack-plugin-webpack-4")
const ExtractCssChunks = require('../extract-css-chunks-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')
const loadPartialConfig = require('@babel/core').loadPartialConfig

let preset = loadPartialConfig({
  presets: [
   [require('@babel/preset-env'), { useBuiltIns: false,modules:"commonjs", debug: true }],
   require('@babel/preset-react'),
   require('@babel/preset-flow')
 ],
 plugins: [
   require('@babel/plugin-proposal-export-default-from'),
   require('@babel/plugin-syntax-dynamic-import'),
   require('babel-plugin-universal-import'),
   require('@babel/plugin-proposal-class-properties'),
   [require('@babel/plugin-transform-runtime'), {
     helpers: false,
     polyfill: false,
     regenerator: true
   }]
 ] 
 })

preset.options.cacheDirectory = true
preset.options.sourceMap = true
preset.options.passPerPreset = false
preset.options.babelrc = false

module.exports = {
  mode: 'development',
  name: 'client',
  target: 'web',
  devtool: 'source-map',
  //devtool: "cheap-module-source-map",
  entry: {
    main: ['@babel/polyfill', "./extract-css-chunks-webpack-plugin/hotModuleReplacement2",
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false',
      path.resolve(__dirname, '../src/index.jsx')]
  },
  cache: true,
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, '../buildClient'),
    publicPath: '/static/'
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      },
      {
        test: /\.rsx?$/,
        use: {
          loader: 'awesome-typescript-loader',
          options: {
            useBabel: true,
            babelOptions: {
              babelrc: false, /* Important line */
              presets: [
                [ "@babel/env",{useBuiltIns:false}],
                "@babel/react",
                "@babel/flow"
              ],
              plugins: [
                "@babel/plugin-proposal-export-default-from",
                "@babel/plugin-syntax-dynamic-import",
                "universal-import",
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-object-rest-spread",
                ["@babel/plugin-transform-runtime", {
                  helpers: false,
                  polyfill: false,
                  regenerator: true
                }]
              ]
            },
            babelCore: "@babel/core" // needed for Babel v7
          }
        }
      },
      {
        test: /(\.jsx?|\.tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: preset.options
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractCssChunks.extract({
          use: [
            { loader: 'cache-loader' },
            { loader: 'thread-loader', options: { workers: 4 } },
            {
              loader: 'css-loader',
              options: {
                //sourceMap: false,
                //sourceMap: true,  <--- give output error for a normal import on page
                modules: true,
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            }]
        })
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: false,
              babelrc: false
            }
          },
          require.resolve('svgr/webpack'),
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: 1000,
              name: '[path][name].[hash:8].[ext]'
            }
          }
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: {
          loader: require.resolve('url-loader'),
          options: {
            limit: 10,
            name: '[path][name].[hash:8].[ext]'
          }
        }

      }
    ]
  }, /*
  optimization: {
     flagIncludedChunks:true,
     occurrenceOrder:true,
     namedModules:false,
     namedChunks:false,
     sideEffects:true,
     usedExports:true,
    
    //concatenateModules: true,
    //mergeDuplicateChunks: true,
    runtimeChunk: true,
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        styles: {
          name: 'bundles/pages/_app.js.css',
          test: /\.(sc|c)ss$/,
          chunks: 'all',
          reuseExistingChunk: true
        },
        vendors: {
        //  priority: 1,
          reuseExistingChunk: false,
          enforce: false,
          test: /(node_modules\/(?!webpack-hot).*\.js)/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    minimize: false
  },*/
  resolve: {
    extensions: ['.mjs', '.ts','.tsx', '.js', '.jsx', '.css', '.scss'],
    alias: {
      'rfx-link': path.resolve(__dirname, '../lib/Link'),
      'rfx': path.resolve(__dirname, '../lib'),
    }
  },
  plugins: [
    new StatsPlugin('stats.json'),
    /*new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: '[name].js',
      minChunks: Infinity
    }),*/


    // new webpack.NoEmitOnErrorsPlugin(),
    new ExtractCssChunks(),
    new AutoDllPlugin({
      sourceMap: false,
      context: path.join(__dirname, '..'),
      filename: '[name].js',
      config: { plugins: [] }, inherit: true,
      entry: {
        vendors: [
          'react',
          'redux',
          'react-dom',
          'react-redux',
          'react-intl',
          'graphql',
          "graphql-yoga",
          "apollo-link",
          "apollo-client",
          "apollo-cache",
          "apollo-cache-inmemory",
          "apollo-boost",
          "svgr",
          "apollo-link-state",
          "apollo-link-ws",
          "apollo-link-http",
          "apollo-link-http-common",
          'apollo-utilities'
          //  'rfx',
          //  "rfx-link"
          //  path.resolve(__dirname, '../lib')
          //  'rfx',
          //  "rfx-link",
          // 'transition-group',
          //  '@babel/polyfill',
          //  'redux-devtools-extension/logOnlyInProduction'
        ]
      }
    }),
    new webpack.HotModuleReplacementPlugin()
    // new WriteFilePlugin(), // used so you can see what chunks are produced in dev
  ]
}
