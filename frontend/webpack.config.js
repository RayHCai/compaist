var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// Load frontend/.env into process.env if present (copy .env.example to start).
var envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
    process.loadEnvFile(envFile);
}

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
        new webpack.EnvironmentPlugin({
            GOOGLE_MAPS_API_KEY: '',
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    devServer: {
        port: 3000,
        historyApiFallback: true,
    },
};
