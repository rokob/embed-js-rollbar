module.exports = {
  entry: {
    component: './component.js',
    other: './other.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: '[name].js'
  },
  devServer: {
    contentBase: './dist'
  }
};
