// Load modules
const fs = require( "fs" );
const path = require( "path" );
const webpack = require( "webpack" );
const autoprefixer = require( "autoprefixer" );
const WebpackOnBuildPlugin = require( "on-build-webpack" );
const request = require( "request" );
const lager = require( "properjs-lager" );
const open = require( "open" );
const config = require( "./boxen.config" );



// Define after config loads
const root = path.resolve( __dirname );
const source = path.join( root, "source" );
const nodeModules = "node_modules";
const plugins = [
    new webpack.LoaderOptionsPlugin({
        options: {
            postcss: [autoprefixer( { browsers: [config.postcss.browsers] } )]
        }
    })
];



module.exports = ( env ) => {
    // Only handle builds for sandbox dev environment
    if ( env.sandbox ) {
        plugins.push(new WebpackOnBuildPlugin(() => {
            // First build opens localhost for you
            if ( config.open ) {
                config.open = false;
                open( `${config.localUrl}` );

            // Subsequent builds trigger SQS reloads
            } else {
                request( { url: config.reloadUrl }, () => lager.server( "sqs local-api reload trigger" ) );
            }
        }));
    }

    return {
        mode: "none",


        devtool: "source-map",


        plugins,


        resolve: {
            modules: [root, source, nodeModules],
            mainFields: ["webpack", "browserify", "web", "hobo", "main"]
        },


        entry: config.webpack.entry,


        output: {
            path: path.resolve( __dirname, "build", "scripts" ),
            filename: "[name].js"
        },


        module: {
            rules: [
                {
                    test: /source\/js\/.*\.js$/,
                    exclude: /node_modules/,
                    loader: "eslint-loader",
                    enforce: "pre",
                    options: {
                        emitError: true,
                        emitWarning: false,
                        failOnError: true,
                        quiet: true
                    }
                },
                {
                    test: /source\/js\/.*\.js$/,
                    exclude: /node_modules|\.config\.js/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: ["env"]
                            }
                        }
                    ]
                },
                {
                    test: /(hobo|hobo.build)\.js$/,
                    use: [
                        "expose-loader?hobo"
                    ]
                },
                {
                    test: /\.(sass|scss)$/,
                    exclude: /node_modules/,
                    use: [
                        "file-loader?name=../styles/[name].css",
                        "postcss-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /svg-.*\.block$|\.svg$/,
                    exclude: /node_modules/,
                    use: [
                        "svg-inline-loader"
                    ]
                }
            ]
        }
    };
};
