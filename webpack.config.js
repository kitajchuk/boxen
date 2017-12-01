const path = require( "path" );
const root = path.resolve( __dirname );
const source = path.join( root, "source" );
const nodeModules = "node_modules";
const webpack = require( "webpack" );
const autoprefixer = require( "autoprefixer" );
const execSync = require( "child_process" ).execSync;
const WebpackOnBuildPlugin = require( "on-build-webpack" );
const request = require( "request" );
const lager = require( "properjs-lager" );
const open = require( "open" );
const local = "http://localhost:9000";
const plugins = [
    new webpack.LoaderOptionsPlugin({
        options: {
            postcss: [autoprefixer( { browsers: ["last 2 versions"] } )]
        }
    })
];
let isOpen = false;



module.exports = ( env ) => {
    // Only handle builds for sandbox dev environment
    if ( env.sandbox ) {
        plugins.push(new WebpackOnBuildPlugin(() => {
            // First build opens localhost for you
            if ( !isOpen ) {
                isOpen = true;
                open( local );

            // Subsequent builds trigger SQS reloads
            } else {
                request({
                    url: `${local}/local-api/reload/trigger`,
                    method: "GET"

                }, () => lager.server( "local-api reload trigger..." ) );
            }
        }));
    }

    return {
        devtool: "source-map",


        plugins,


        resolve: {
            modules: [root, source, nodeModules],
            mainFields: ["webpack", "browserify", "web", "hobo", "main"]
        },


        entry: {
            "app": path.resolve( __dirname, "source/js/app.js" )
        },


        output: {
            path: path.resolve( __dirname, "build", "scripts" ),
            filename: "[name].js"
        },


        module: {
            rules: [
                { test: /source\/js\/.*\.js$/, exclude: /node_modules/, use: ["eslint-loader"], enforce: "pre" },
                { test: /source\/js\/.*\.js$/, exclude: /node_modules/, use: [{ loader: "babel-loader", options: { presets: ["es2015"] } }] },
                { test: /(hobo|hobo.build)\.js$/, use: ["expose-loader?hobo"] },
                { test: /\.(sass|scss)$/, exclude: /node_modules/, use: ["file-loader?name=../styles/[name].css", "postcss-loader", "sass-loader"] },
                { test: /svg-.*\.block$|\.svg$/, exclude: /node_modules/, use: ["svg-inline-loader"] }
            ]
        }
    };
};
