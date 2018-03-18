const path = require('path');

const MySweetResolverPlugin = require('./MySweetResolverPlugin');

module.exports = {
  entry: path.resolve('src/index.js'),
  output: {
    path: path.resolve('dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new MySweetResolverPlugin(),
  ],
};
