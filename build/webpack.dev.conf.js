const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html模板
const ip = require('ip').address();
const resolve = (dir) => path.join(__dirname, '..', dir);
const stories = require('../stories/getStories')

module.exports = {
  mode: 'development', // webpack4新增属性，默认返回production,提供一些默认配置，例如cache:true
  devtool: 'cheap-module-eval-source-map',
  // source-map每个module生成对应的map文件
  // eval 每一个module模块执行eval，不生成map文件，在尾部生成一个sourceURL对应前后关系，所以更快
  // cheap 列信息 VLQ编码
  // module 包含了模块之间的sourcemap
  entry: {
    index: './src/index.js', // 设置入口文件
    iframe: './src/iframe.entry.js',
    vendor: [path.resolve('node_modules/phantom-limb/index.js'),'babel-polyfill']
  },
  output: {
    filename: '[name].js', // 生成的js文件的名字
    path: resolve('dist'), // 生成的js存放目录
  },
  module: { // 配置loader
    rules: [
      {
        test: /\.m?js$/,
        include: resolve('src'), // 只解析src下面的文件,不推荐用exclude
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.vue$/,
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
        }],
      },
    ],
  },
  devServer: { // 配置webpack-dev-server， 在本地启动一个服务器运行
    host: ip, // 服务器的ip地址 希望服务器外可以访问就设置 0.0.0.0
    port: 8088, // 端口
    open: true, // 自动打开页面
    hot: true, // 设置热更新(引用react热更新必须设置)
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: resolve('/dist/index.html'), // 生成的html文件存放的地址和文件名
      template: resolve("/index.html"), // 基于index.html模板进行生成html文件
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      filename: resolve('/dist/iframe.html'),
      template: resolve("/iframe.html"),
      isDevServer: true,
      chunksSortMode: 'dependency',
      inject: true,
      chunks: ['vendor', 'iframe']
    }),
    /*
    * Plugin: BannerPlugin
    * Description: Adds a banner to the top of each generated chunk.
    * See: https://webpack.js.org/plugins/banner-plugin/
    */
    new webpack.BannerPlugin({
      banner: '// { "framework": "Vue"} \n',
      raw: true
    }),
    new webpack.DefinePlugin({
      STORYBOOK_STORIES: JSON.stringify(stories)
    })
  ]
}
