// Load modules
const fs = require( "fs" );
const path = require( "path" );
const webpack = require( "webpack" );
const lager = require( "properjs-lager" );
const open = require( "open" );
const fetch = require( "node-fetch" );
const root = path.resolve( __dirname );
const source = path.join( root, "source" );
const nodeModules = "node_modules";
const config = require( "./boxen.config" );
const ESLintPlugin = require( "eslint-webpack-plugin" );



// https://webpack.js.org/contribute/writing-a-plugin/
// https://webpack.js.org/api/compiler-hooks/
class BoxenHooksPlugin {
    constructor ( options ) {
        this.options = options;
    }

    apply ( compiler ) {
        compiler.hooks.afterCompile.tap( "BoxenHooksPlugin", ( compilation ) => {
            if ( typeof this.options.afterCompile === "function" ) {
                this.options.afterCompile();
            }
        });
    }
}



// Define after config loads
const plugins = [
    new ESLintPlugin({
        emitError: true,
        emitWarning: false,
        failOnError: true,
        quiet: true,
        context: path.resolve( __dirname, "source" ),
        exclude: [
            "node_modules",
        ],
    }),
];
const pluginHooks = new BoxenHooksPlugin({
    afterCompile: () => {
        // First build opens localhost for you
        if ( config.open ) {
            config.open = false;
            open( `${config.browserUrl}` );

        // Subsequent builds trigger SQS reloads
        } else {
            fetch( config.reloadUrl ).then(() => {
                lager.server( "sqs local-api reload trigger" );
            });
        }
    },
});



const webpackConfig = ( env, argv ) => {
    // Only handle builds for sandbox dev environment
    if ( env.sandbox ) {
        plugins.push( pluginHooks );
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



module.exports = [
    webpackConfig,
];
