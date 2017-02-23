var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var srcDir = path.resolve(__dirname, 'src/js');
function getEntry() {
  var jsPath = path.resolve(srcDir, 'pages');
  var dirs = fs.readdirSync(jsPath);
  var matchs = [], files = {};
  dirs.forEach(function (item) {
    matchs = item.match(/(.+)\.js$/);
    if (matchs) {
      files[matchs[1]] = path.resolve(srcDir, 'pages', item);
    }
  });
  return files;
}
module.exports = {
  entry: getEntry(),         //获取项目入口js文件
  output: {
    path: path.join(__dirname, "dist/js/"), //文件输出目录
    //publicPath: "js/",        //用于配置文件发布路径，如CDN或本地服务器
    filename: "[name].js"        //根据入口文件输出的对应多个文件名
  },
  module: {
    //各种加载器，即让各种文件格式可用require引用
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        include: path.join(path.resolve(__dirname,'src')),
        query: {
          presets: ['es2015']
        }
      },
      {test: /\.html$/, loader: "html?minimize=true" },
      {test: /\.ttf$/, loader: 'url-loader?name=[name].[ext]' },
      {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
      {test: /\.(png|jpg|gif)$/, loader: 'url-loader?'},
      { test: /\.json$/, loader: ExtractTextPlugin.extract('file-loader?name=../json/[name].json') }
    ]
  },
  resolve: {
    root: []
  },
  plugins: [
    new ExtractTextPlugin("../css/[name].css"),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.ProvidePlugin({
      $: 'mui',
      mui: 'mui',
      'window.mui': 'mui'
    }),
    new HtmlWebpackPlugin({
      filename:"../pages/test.html",
      template: 'src/pages/test.html',
      chunks:['test']
    })
  ]
};
