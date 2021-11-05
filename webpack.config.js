const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

let mode = 'development';
const plugins = [
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }),
];

if (process.env.NODE_ENV === 'production') {
  mode = 'production';
  plugins.push(
    new ESLintPlugin({
      context: './src',
      extensions: ['.js', '.jsx', '.ts', 'tsx'],
    }),
    new StyleLintPlugin({
      context: './src',
    }),
  );
}
if (process.env.SERVE) {
  plugins.push(new ReactRefreshWebpackPlugin());
}

module.exports = {
  mode,
  entry: './src/index.tsx',
  devtool: 'source-map',
  plugins,

  output: {
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'images/[hash][ext][query]',
    clean: true,
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  devServer: {
    static: './dist',
    hot: true,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)/i,
        exclude: /node_modules/i,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(css|scss|sass)$/i,
        exclude: /node_modules/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /.(png|jpe?g|svg|gif)$/i,
        type: 'asset',
      },
    ],
  },
};
