const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    client: './src/game/main.ts',
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'js/[name].chunkhash.bundle.js',
    chunkFilename: 'js/[name].chunkhash.bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(path.join(__dirname, 'node_modules'))],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: ['ts-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          enforce: true
        },
      },
    },
  },
};
