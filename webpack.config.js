module.exports = {
   entry: './src/index.jsx',
   output: {
      filename: 'index.js',
      libraryTarget: 'umd',
      library: 'ReactScrollPagination'
   },
   module: {
      rules: [
         {
            test: /\.(js|jsx)$/,
            use: [{
               loader: 'babel-loader',
               options: {
                  babelrc: false,
                  configFile: false,
                  compact: false,
                  cacheDirectory: true,
                  ignore: [ /cjs/, /node_modules/ ],
                  presets: [
                     [
                        "@babel/preset-env",
                        {
                           "modules": false,
                           "targets": {
                              "browsers": "> 1%",
                           },
                           "useBuiltIns": false,
                           "forceAllTransforms": true
                        },
                     ],
                     [
                        "@babel/preset-react",
                        {
                           runtime: "classic"
                        }
                     ]
                  ],
                  plugins: [
                     [ "@babel/transform-runtime", {
                        helpers: false,
                        regenerator: true,
                     }],
                     [
                        "@babel/plugin-proposal-class-properties",
                        {
                           "spec": true,
                           "loose": true
                        }
                     ],
                     '@babel/plugin-transform-react-inline-elements',
                  ],
               },
            }]
         },
      ],
   },
}
