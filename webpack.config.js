module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'dist/index.js',
    libraryTarget: 'umd',
    library: 'ReactScrollPagination'
  },
  externals: {
    react: 'React'
  },
  module:{
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0', 'react'],
            plugins: ['transform-runtime'],
            ignore: /node_modules/,
          }
        }
      }
    ]
  }
}
