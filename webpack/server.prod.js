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
  !/\.bin|react-universal-component|require-universal-module|webpack-flush-chunks|path-to-regexp/.test(x))
.reduce((externals, mod) => {
  externals[mod] = `commonjs ${mod}`
  return externals
}, {})

module.exports = {
  mode: 'production',
  name: 'server',
  target: 'node',
  devtool: 'source-map',
  entry: ['fetch-everywhere',res('../server/render.js')],
  externals,
  output: {
    path: res('../buildServer'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    publicPath: '/static/'
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
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
      },{
        test: /^((?!StyleApp).)*\.css$/,
        exclude: /node_modules/,
        use: {
          loader: 'css-loader/locals',
          options: {
            modules: true,
            localIdentName: '[name]__[local]--[hash:base64:5]'
          }
        }
      },
      {
        test: /font-awesome\.scss$/,
        use: ExtractCssChunks.extract({
          use: [
            {loader: 'cache-loader'},
            {loader: 'thread-loader', options: {workers: 4}},
            {
              loader: "css-loader",
              options: {
                modules: false,
                minimize: true,
                sourceMap: false,
                importLoaders: 4, //4 because cache-loader/thread-loader
                url: false, //prevent to change url with static folder (we are in serverside here)
              }
            },
            {
              loader: "postcss-loader",
              options: {
                config: {
                  ctx: {
                    postcssurl: true,
                    cssnext: {
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9'
                      ],
                      flexbox: 'no-2009',
                      compress: true
                    }
                  },
                  path: path.resolve(process.cwd(), './postcss.config.js')
                }
              }
            },
            {
              loader: "sass-loader",
              options: {
                context: process.cwd(), //dont touch that.. seems sass-loader not ready for webpack4
              }
            }
          ]
          // use: 'happypack/loader?id=styles'
        })
        // use: []
      },
      {
        test: /StyleApp\.scss$/,
        use: ExtractCssChunks.extract({
          use: [
            {loader: 'cache-loader'},
            {loader: 'thread-loader', options: {workers: 4}},
            {
              loader: "css-loader",
              options: {
                modules: false,
                minimize: true,
                sourceMap: false,
                importLoaders: 4, //4 because cache-loader/thread-loader
                url: false
              }
            },
            {
              loader: "postcss-loader",
              options: {
                config: {
                  ctx: {
                    cssnext: {
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9'
                      ],
                      flexbox: 'no-2009',
                      compress: true
                    }
                  },
                  path: path.resolve(process.cwd(), './postcss.config.js')
                }
              }
            },
            {
              loader: "sass-loader",
              options: {
                context: process.cwd(), //dont touch that.. seems sass-loader not ready for webpack4
              }
            }
          ]
        })
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
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
          loader: 'url-loader',
          options: {
            limit: 10,
            name: '[path][name].[hash:8].[ext]'
          }
        }
      },
      {
        test: /\.woff(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              emitFile: true,
              mimetype: "application/font-woff",
              name: '[path][name].[ext]',
            }
          }]
      },
      {
        test: /\.ttf(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              emitFile: true,
              mimetype: "application/octet-stream",
              name: '[path][name].[ext]',
            }
          }]
      },
      {
        test: /\.woff2(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              emitFile: true,
              mimetype: "application/font-woff2",
              name: '[path][name].[ext]',
            }
          }]
      },
      {
        test: /\.otf(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              emitFile: true,
              mimetype: "font/opentype",
              name: '[path][name].[ext]',
            }
          }]
      },
      {
        test: /\.eot(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              emitFile: true,
              mimetype: "font/opentype",
              name: '[path][name].[ext]',
            }
          }]
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, '../'), path.resolve(__dirname, "../node_modules"), path.resolve(__dirname, "../font-awesome")],
    extensions: ['.mjs', '.js', '.jsx', '.css', '.scss'], //for graphql assure be mjs before all other ext https://github.com/graphql/graphql-js/issues/1272#issuecomment-377384574
    alias: {
      'rfx-link': path.resolve(__dirname, '../lib/Link'),
      'rfx': path.resolve(__dirname, '../lib'),
    }
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
