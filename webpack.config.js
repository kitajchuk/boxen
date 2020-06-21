// Load modules
const fs = require( "fs" );
const path = require( "path" );
const webpack = require( "webpack" );
const WebpackOnBuildPlugin = require( "on-build-webpack" );
const request = require( "request" );
const lager = require( "properjs-lager" );
const open = require( "open" );
const root = path.resolve( __dirname );
const source = path.join( root, "source" );
const nodeModules = "node_modules";
const config = require( "./boxen.config" );



// Define after config loads
const plugins = [];
const pluginOnBuild = new WebpackOnBuildPlugin(() => {
    // First build opens localhost for you
    if ( config.open ) {
        config.open = false;
        open( `${config.browserUrl}` );

    // Subsequent builds trigger SQS reloads
    } else {
        request( { url: config.reloadUrl }, () => {
            lager.server( "sqs local-api reload trigger" );
        });
    }
});



module.exports = ( env ) => {
    // Only handle builds for sandbox dev environment
    if ( env.sandbox ) {
        plugins.push( pluginOnBuild );
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
                    test: /source\/.*\.js$/i,
                    exclude: /node_modules/,
                    loader: "eslint-loader",
                    enforce: "pre",
                    options: {
                        emitError: true,
                        emitWarning: false,
                        failOnError: true,
                        quiet: true,
                    },
                },
                {
                    // test: /source\/.*\.js$/i,
                    // exclude: /node_modules/,
                    test: /source\/.*\.js$|node_modules\/[properjs-|konami-|paramalama].*/i,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: ["@babel/preset-env"],
                            },
                        },
                    ],
                },
                {
                    test: /(hobo|hobo.build)\.js$/i,
                    use: ["expose-loader?hobo"],
                },
                {
                    test: /\.s[ac]ss$/i,
                    exclude: /node_modules/,
                    use: [
                        "file-loader?name=../styles/[name].css",
                        "sass-loader",
                    ],
                },
                {
                    test: /svg-.*\.block$|\.svg$/i,
                    exclude: /node_modules/,
                    use: [
                        "svg-inline-loader",
                    ],
                },
            ]
        }
    };
};
