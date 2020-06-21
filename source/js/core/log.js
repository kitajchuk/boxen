import env from "./env";


/**
 *
 * @public
 * @method log
 * @memberof core
 * @description Normalized app console logger.
 *              If you want to use another console method like `info` or `warn`
 *              you can pass it as the first argument to the `log` method here.
 *              The default method that will be assumed is `console.log`.
 *
 *              Examples:
 *              log( "info", ...args )
 *              log( "warn", ...args )
 *              log( "trace", ...args )
 *              log( "debug", ...args )
 *
 */
const log = function ( ...args ) {
    // Only log for development environments
    if ( !env.isDev() || !("console" in window) ) {
        return;
    }

    let method = "log";

    // First arg can be another `console` method to call ?
    if ( typeof console[ args[ 0 ] ] === "function" ) {
        method = args[ 0 ];
        args = args.slice( 1, args.length );
    }

    window.console[ method ]( args );
};



/******************************************************************************
 * Export
*******************************************************************************/
export default log;