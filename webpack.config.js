const path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: "./src/rpg/index.ts",
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'js/bundle.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve(path.join(__dirname, 'node_modules'))]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: ['ts-loader']
            }
        ]
    }
};
