const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
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
  new webpack.ProvidePlugin({
    process: 'process/browser',
  }),
  new webpack.EnvironmentPlugin({
    PUBLIC_URL: process.env.PUBLIC_URL ?? '',
    ROUTER_BASE: process.env.ROUTER_BASE ?? '',
  }),
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
  };
}
if (process.env.SERVE) {
  plugins.push(new ReactRefreshWebpackPlugin());
}

let publicPath = '/';
if (process.env.ROUTER_BASE && process.env.ROUTER_BASE.trim().length !== 0) {
  publicPath = `/${process.env.ROUTER_BASE ?? ''}/`;
}

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode,
  entry: './src/index.tsx',
  devtool: mode === 'production' ? undefined : 'source-map',
  plugins,
  optimization,

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath,
    assetModuleFilename: 'images/[hash][ext][query]',
    clean: true,
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  devServer: {
    static: './dist',
    hot: true,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)/i,
        exclude: /node_modules/i,
        use: {
          loader: 'babel-loader',
        },
        sideEffects: true,
      },
      {
        test: /\.(css|scss|sass)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                auto: true,
                localIdentName:
                  mode === 'production' ? '[hash:base64]' : '[folder]__[local]--[hash:base64:3]',
              },
            },
          },
          'postcss-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'src/scss')],
              },
            },
          },
        ],
        sideEffects: true,
      },
      {
        test: /.(png|jpe?g|svg|gif)$/i,
        type: 'asset',
      },
    ],
  },
};
