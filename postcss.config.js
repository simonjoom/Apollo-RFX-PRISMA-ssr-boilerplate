//var smartImport = require("postcss-smart-import")

const path = require('path')
module.exports = ({file, options, env}) => {
  var debug = true;
  console.log(options)
  return {
    parser: 'postcss-scss',
    plugins: {
      //smartImport(),
      'postcss-import': {
        root: file.dirname,
        //  addModulesDirectories: [path.resolve(__dirname, './font-awesome')]
      },
      'postcss-custom-media': require('postcss-custom-media'),
      "postcss-url": options.postcssurl ? [
        {
          url: 'copy',
          basePath: path.resolve(""),
          // dir to copy assets
          assetsPath: path.resolve("./buildServer"),
          // using hash names for assets (generates from asset content)
          // useHash: true
        },
        {
          filter: '**/fontawesome-*',
          url(asset) {
            console.log("filterfont")
            var url = asset.url.replace("buildServer/", '');
            return url;
          },
          multi:true
          // using hash names for assets (generates from asset content)
          // useHash: true
        }] : false,
      // 'postcss-preset-env': options.cssnext && !debug ? options.cssnext : false
      'postcss-preset-env': options.cssnext
      //env == 'production' ? options.autoprefixer : false,
      //     'cssnano': env === 'production' ? options.cssnano : false
    }
  }
}
