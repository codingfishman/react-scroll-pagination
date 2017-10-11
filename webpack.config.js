module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'dist/index.js',
    libraryTarget: 'umd',
    library: 'ReactScrollPagination'
  },
  externals: {
    react:'React',
    jquery: 'jQuery'
  },
  module:{
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0', 'react'],
            plugins: ['transform-runtime']
          }
        }
      }
    ]
  }
}