const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const babel = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
        loader: "babel-loader"
    }
};
const scss = {
    test: /\.scss$/,
    use: [
        MiniCssExtractPlugin.loader,
        "css-loader",
        {
            loader: "clean-css-loader",
            options: {
                compatibility: "ie9",
                level: 2,
                inline: ["remote"]
            }
        },
        "postcss-loader",
        "sass-loader"
    ]
};
const images = {
    test: /\.(jpg|png|svg|pdf|zip)$/,
    use: {
        loader: "file-loader",
        options: {
            name: "[path][name].[ext]"
        }
    }
};
const config = {
    entry: { main: "./src/main.js" },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    module: {
        rules: [babel, scss, images]
    },
    devServer: {
        contentBase: path.join(__dirname, "/dist/"),
        watchContentBase: true,
        port: 8000,
        disableHostCheck: true
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "main.css"
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ]
};

module.exports = config;
