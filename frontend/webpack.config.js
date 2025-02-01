var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    resolve: {
        modules: [
            path.join(__dirname, 'src'),
            'node_modules',
            path.join(__dirname, 'public'),
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.html'],
        alias: {
            react: path.join(__dirname, 'node_modules', 'react'),
            '@': path.join(__dirname, 'src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader',
                ],
            },
            {
                test: /\.([cm]?ts|tsx)$/,
                loader: 'ts-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    devServer: {
        port: 3000,
        historyApiFallback: true,
    },
};
