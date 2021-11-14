const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack');

let mode = 'development';
const plugins = [
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }),
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'src/locales'),
        to: path.resolve(__dirname, 'dist/locales'),
      },
    ],
  }),
  new webpack.EnvironmentPlugin({ PUBLIC_URL: process.env.PUBLIC_URL ?? '' }),
];

let optimization = {};

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

  optimization = {
    ...optimization,
    // minimizer: [new CssMinimizerPlugin()],
    // minimize: true,
  };
}
if (process.env.SERVE) {
  plugins.push(new ReactRefreshWebpackPlugin());
}

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode,
  entry: './src/index.tsx',
  devtool: 'source-map',
  plugins,
  optimization,

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
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'resolve-url-loader',
          'sass-loader',
        ],
      },
      {
        test: /.(png|jpe?g|svg|gif)$/i,
        type: 'asset',
      },
    ],
  },
};
