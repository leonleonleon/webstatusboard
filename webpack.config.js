const path    = require( 'path' );
const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

const SRC_DIR = `${__dirname}/src`;

module.exports = {
    entry : './src/index.js',

    output : {
        // options related to how webpack emits results

        path : path.resolve( __dirname, 'dist' ), // string

        filename        : 'js/app.js',
        chunkFilename   : 'js/app.[name].js',
    },

    devtool : 'cheap-eval-source-map',

    module : {
        rules : [
            {
                test    : /\.jsx?/,
                use     : [
                    {
                        loader : 'babel-loader',
                    },
                ],
                include : SRC_DIR,
            },
            {
                test    : /\.css$/i,
                include : SRC_DIR,
                use     : [ {
                    loader : 'style-loader',    // creates style nodes from JS strings
                }, {
                    // translates CSS into CommonJS
                    loader  : 'css-loader',
                    options : {
                        minimize        : true,
                        modules         : true,
                        localIdentName  : '[name]__[local]--[hash:base64:5]',
                        importLoaders   : 1,
                        root            : '.',
                        url             : true,
                    },
                } ],
            },
        ],
    },
    resolve : {
        modules : [
            'node_modules',
            path.resolve( __dirname, 'src' ),
        ],
    },
    context   : __dirname, // string (absolute path!)
    target    : 'web',
    devServer : {
        contentBase        : path.join( __dirname, 'public' ),
        compress           : true, // enable gzip compression
        historyApiFallback : true, // true for index.html upon 404, object for multiple paths
        hot                : true, // hot module replacement. Depends on HotModuleReplacementPlugin
        https              : false, // true for self-signed, object for cert authority
        noInfo             : true, // only errors & warns on hot reload
    },
    plugins : [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin( {
            title    : 'Development',
            template : 'public/index.html',
        } ),
    ],
};
