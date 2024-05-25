import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const glob = require("glob")

import "webpack-dev-server"

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : "style-loader";

const config : webpack.Configuration = {
    entry: {
        "main": path.resolve(__dirname, "public", "index.ts"),
        "sw": path.resolve(__dirname, "public", "sw.js")
    },
    output: {
        path: path.resolve(__dirname, "dist")
    },
    devServer: {
        open: true,
        host: "localhost",
        port: 8010,
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
        new CopyPlugin({
            patterns: [
                { from: "manifest.json", to: "" },
            ],
        }),
        new ImageminPlugin({
            externalImages: {
                context: ".",
                destination: "dist/assets",
                fileName: "[name].[ext]",
                sources: glob.sync("public/src/assets/**/*.{png,jpg,jpeg,svg}")
            }
        })
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
                            ["@babel/preset-typescript", { targets: "defaults" }]
                        ],
                        plugins: [
                            [
                                "@babel/plugin-transform-react-jsx",
                                { runtime: "automatic", importSource: "/public/src/lib/scReact/" },
                            ]
                        ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,"css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    stylesHandler,
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ],
            },
            {
                test: /\.(eot|svg|png|jpg|gif)$/i,
                type: "asset"
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
            }
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";
        
        config.plugins.push(new MiniCssExtractPlugin());

        
    } else {
        config.mode = "development";
    }
    return config;
};

export default config;