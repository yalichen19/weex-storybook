const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('./config');
const helper = require('./helper');
const glob = require('glob');
const vueWebTemp = helper.rootNode(config.templateDir);
const isWin = /^win/.test(process.platform);
const webEntry = {};
const weexEntry = {};
const resolve = (dir) => path.join(__dirname, '..', dir);

// Wraping the entry file for web.
const getWebEntryFileContent = (entryPath, vueFilePath) => {
  let relativeVuePath = path.relative(path.join(entryPath, '../'), vueFilePath);

  let contents = '';
  if (isWin) {
    relativeVuePath = relativeVuePath.replace(/\\/g, '\\\\');
  }
  contents += `
  import App from'${relativeVuePath}'
  new Vue(Vue.util.extend({el: '#root'}, App));
`;
  return contents;
}

// Wraping the entry file for native.
const getNativeEntryFileContent = (entryPath, vueFilePath) => {
  let relativeVuePath = path.relative(path.join(entryPath, '../'), vueFilePath);
  let contents = '';
  if (isWin) {
    relativeVuePath = relativeVuePath.replace(/\\/g, '\\\\');
  }
  contents += `import App from '${relativeVuePath}'
App.el = '#root'
new Vue(App)
`;

  return contents;
}

// Retrieve entry file mappings by function recursion
const getEntryFile = (dir) => {
  dir = dir || config.sourceDir;
  const enrtys = glob.sync(`${dir}/${config.entryFilter}`, config.entryFilterOptions);
  enrtys.forEach(entry => {
    const extname = path.extname(entry);
    const basename = entry.replace(`${dir}/components/`, '').replace(extname, '');
    const templatePathForWeb = path.join(vueWebTemp, basename + '.web.js');
    const templatePathForNative = path.join(vueWebTemp, basename + '.js');

    fs.outputFileSync(templatePathForWeb, getWebEntryFileContent(templatePathForWeb, entry));
    fs.outputFileSync(templatePathForNative, getNativeEntryFileContent(templatePathForNative, entry));
    webEntry[basename] = templatePathForWeb;
    weexEntry[basename] = [templatePathForNative];
  })
}

// Generate an entry file array before writing a webpack configuration
getEntryFile();



/**
 * Plugins for webpack configuration.
 */
const plugins = [
  /*
   * Plugin: BannerPlugin
   * Description: Adds a banner to the top of each generated chunk.
   * See: https://webpack.js.org/plugins/banner-plugin/
   */
  new webpack.BannerPlugin({
    banner: '// { "framework": "Vue"} \n',
    raw: true,
  })

];
// Config for compile jsbundle for web.
const webConfig = {
  entry: webEntry,
  output: {
    path: resolve('dist'),
    filename: '[name].web.js',
  },
  /**
   * Options affecting the resolving of modules.
   * See http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': helper.resolve('src')
    }
  },
  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {
    // webpack 4.0
    rules: [
      {
        test: /\.(less|css)$/,
        use: [
          { loader: 'less-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader'
        }]
      },
      {
        test: /\.vue(\?[^?]+)?$/,
        use: [{
          loader: 'vue-loader',
          options: {
            threadMode: true,
            optimizeSSR: false,
            postcss: [
              require('postcss-plugin-weex')(),
              require('autoprefixer')({
                browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
              }),
              require('postcss-plugin-px2rem')({ rootValue: 75 })
            ],
            compilerModules: [
              {
                // to convert vnode for weex components.
                postTransformNode: el => require('weex-vue-precompiler')()(el)
              }
            ]
          }
        }]
      },
    ]
  },
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: plugins
};

// Config for compile jsbundle for native.
const weexConfig = {
  entry: weexEntry,
  output: {
    path: resolve('dist'),
    filename: '[name].weex.js'
  },
  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  resolve: {
    extensions: ['.js', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [
          { loader: 'less-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader'
        }]
      },
      {
        test: /\.vue$/,
        use: [{
          loader: 'weex-loader',
        }],
      }
    ]
  },
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: plugins,

};
module.exports = [webConfig, weexConfig];
