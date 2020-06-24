const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
    mode: 'production'
}
plugins: [
  new HtmlWebpackPlugin({
    inject: true,
    template: paths.appHtml
  }),
  new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw)
]
plugins: [
  ...
  new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[id].css"
  }),
  ...
],
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
        // you can specify a publicPath here
        // by default it use publicPath in webpackOptions.output
        publicPath: '../'
      }
    },
    "css-loader"
  ]
}]}