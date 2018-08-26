const path = require("path");
const webpack = require('webpack');

module.exports = {
    entry: __dirname + '/app/index.js',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                enforce: 'pre',
                loader: 'tslint-loader',
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.(ts|tsx)?$/, 
                exclude: /node_modules/,
                loader: "ts-loader"                
            },
        ]
    },
    output: {
        filename: 'transformed.js',
        path: path.join(__dirname, '/public'),
        publicPath: "/public/"
    },
    watch: true,
    devtool: "#eval-source-map",
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
          }),
          new webpack.DefinePlugin({
              'process.env': {
                  NODE_ENV: JSON.stringify('development')
              }
          })
      ],
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    },
};