const { resolve } = require('path');

const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env = {}) => ({
  mode: env.prod ? 'production' : 'development',
  devtool: env.prod ? 'source-map' : 'cheap-module-eval-source-map',
  entry: resolve(__dirname, './src/main.ts'),
  output: {
    path: resolve(__dirname, './dist'),
    publicPath: '/',
  },
  resolve: {
    alias: {
      // this isn't technically needed, since the default `vue` entry for bundlers
      // is a simple `export * from '@vue/runtime-dom`. However having this
      // extra re-export somehow causes webpack to always invalidate the module
      // on the first HMR update and causes the page to reload.
      vue: '@vue/runtime-dom',
      '@': resolve(__dirname, './src'),
      '~node_modules': resolve(__dirname, './node_modules'),
    },
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      /*
      {
        test: /\.png$/,
        use: {
          loader: 'url-loader',
          options: { limit: 8192 },
        },
      },
      */
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: !env.prod },
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.[jt]s$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        //        { from: 'src/assets', to: 'dist/assets' },
        { from: 'src/index.html', to: 'dist/index.html' },
      ],
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  devServer: {
    inline: true,
    hot: true,
    contentBase: resolve(__dirname, './src'),
    overlay: true,
    historyApiFallback: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
});
