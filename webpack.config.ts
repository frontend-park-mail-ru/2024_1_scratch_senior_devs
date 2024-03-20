import path from 'path';
import webpack from "webpack";
import HtmlWebpackPlugin from 'html-webpack-plugin';

import 'webpack-dev-server'

const isProduction = process.env.NODE_ENV == 'production';

const config : webpack.Configuration = {
    entry: path.resolve(__dirname, 'public', 'index.ts'),
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        open: true,
        host: 'localhost',
        port: 8010,
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ['@babel/preset-typescript', { targets: "defaults" }]
                        ],
                        plugins: [
                            [
                                '@babel/plugin-transform-react-jsx',
                                { runtime: "automatic", importSource: "/public/src/lib/scReact/" },
                            ]
                        ]
                    }
                }
            }

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        

        
    } else {
        config.mode = 'development';
    }
    return config;
};

export default config;