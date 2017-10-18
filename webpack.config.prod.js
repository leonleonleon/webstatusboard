const path    = require( 'path' );
const webpack = require( 'webpack' );

const ALWAYS_USE_ORIGINAL_QUOTES = 3;

const SRC_DIR = `${__dirname}/src`;

module.exports = {
    entry : './src/index.js',

    output : {
        // options related to how webpack emits results

        path : path.resolve( __dirname, 'dist' ), // string

        filename        : 'js/app.js',
        chunkFilename   : 'js/app.[name].js',
    },

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
    plugins : [
        new webpack.DefinePlugin(
            {
                'process.env' : {
                    'NODE_ENV' : JSON.stringify( 'production' ),
                },
            }
        ),

        // Uglify options used when webpack is run with `-p` flag.
        new webpack.optimize.UglifyJsPlugin(
            {
                mangle   : true,
                compress :
                {
                    warnings        : false,
                    sequences       : true,
                    dead_code       : true, // eslint-disable-line
                    conditionals    : true,
                    comparisons     : true,
                    evaluate        : true,
                    booleans        : true,
                    loops           : true,
                    unused          : true,
                    if_return       : true, // eslint-disable-line
                    join_vars       : true, // eslint-disable-line
                    drop_console    : true, // eslint-disable-line
                    drop_debugger   : true, // eslint-disable-line
                    unsafe_proto    : true, // eslint-disable-line
                    properties      : true,
                    cascade         : true,
                    toplevel        : true,
                    expression      : true,
                    reduce_vars     : true,  // eslint-disable-line camelcase
                    keep_fnames     : false, // eslint-disable-line camelcase
                },
                output : {
                    beautify     : false,
                    comments     : false,
                    quote_style  : ALWAYS_USE_ORIGINAL_QUOTES, // eslint-disable-line
                },
                sourceMap    : false,
            }
        ),
    ],
};
