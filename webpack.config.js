const path = require('path');
const webpack = require('webpack');
const env = require('./scripts/env');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

const fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
];

const plugins = [
  new webpack.ProgressPlugin(),
  // clean the build folder
  new CleanWebpackPlugin({
    verbose: true,
    cleanStaleWebpackAssets: false,
  }),
  // expose and write the allowed env vars on the compiled bundle
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: 'manifest.json',
        to: path.join(__dirname, 'dist'),
        force: true,
        transform: function (content, path) {
          // generates the manifest file using the package.json informations
          return Buffer.from(
            JSON.stringify(
              {
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
              },
              null,
              '\t'
            )
          );
        },
      },
      {
        from: 'img',
        to: path.join(__dirname, 'dist', 'img'),
      },
      {
        from: 'src/option',
        to: path.join(__dirname, 'dist', 'option'),
        globOptions: {
          ignore: ['**/*.ts'],
        },
      },
      {
        from: 'src/popup',
        to: path.join(__dirname, 'dist', 'popup'),
        globOptions: {
          ignore: ['**/*.ts'],
        },
      },
    ],
  }),
  new WriteFilePlugin(),
];

if (!isDevelopment) {
  plugins.push(
    new ZipPlugin({
      filename: 'brancho.zip',
      path: path.resolve(__dirname, 'build'),
      pathPrefix: '',
    })
  );
}


module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    background: path.join(__dirname, 'src', 'background.ts'),
    content: path.join(__dirname, 'src', 'content.ts'),
    option: path.join(__dirname, 'src/option', 'option.ts'),
    popup: path.join(__dirname, 'src/popup', 'popup.ts'),
  },
  output: {
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist'),
    filename: (pathData) => {
      const name = pathData.chunk.name;
      if (name === 'option') {
        return 'option/[name].js';
      }
      if (name === 'popup') {
        return 'popup/[name].js';
      }
      return '[name].js';
    },
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/, // New rule for TypeScript files
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.jsx', '.js', '.css', '.ts']),
  },
  plugins,
  devtool: isDevelopment ? 'cheap-module-source-map' : false,
};


