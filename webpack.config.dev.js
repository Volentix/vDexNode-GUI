module.exports = {
    mode: 'development'
}
plugins: [
  new HtmlWebpackPlugin({
    inject: true,
    template: paths.appHtml
  }),
  new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw)
]
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  ...
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  }
}