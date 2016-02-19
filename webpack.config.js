// webpack.config.js
//
const path              = require('path');
const webpack           = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PUBLIC       = __dirname + "/build";
const PACKAGE_JSON = require('./package.json');
const BUILD_DEV    = !! JSON.parse(process.env.BUILD_DEV || 'true');

var plugins = [
    new webpack.DefinePlugin({
                         'DEBUG': JSON.stringify(BUILD_DEV),
              '__PACKAGE_NAME__': "'"+PACKAGE_JSON.name+"'",
           '__PACKAGE_VERSION__': "'"+PACKAGE_JSON.version+"'",
    }),
    new CopyWebpackPlugin([
        { from: 'examples', to: 'examples' },
        { from: 'assets', to: 'assets' },
        { from: 'index.html' },
    ])
];

if (!BUILD_DEV) {

    console.log('!!!!! RELEASE BUILD !!!!!\n');

    plugins.push(new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        compress: {
            warnings: false,
        },
    }));

}

module.exports = {
    entry: "./src/picimo.js",
    resolve: {
        root: [
            path.resolve('./src'),
        ],
        modulesDirectories: [
            "node_modules",
        ]
    },
    output: {
        library: 'Picimo',
        libraryTarget: 'umd',
        path: PUBLIC,
        filename: (BUILD_DEV ? "picimo.js" : "picimo.min.js")
    },
    plugins: plugins,
    devtool: "#inline-source-map",
    devServer: {
        contentBase: PUBLIC,
        host: "0.0.0.0"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: "babel-loader" },
        ],
        noParse: [/eventize-js.eventize.js$/]
    },
};

