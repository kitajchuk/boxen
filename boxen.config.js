// Load config
let config = null;

try {
    config = require( "./boxen.utils" ).read( require( "path" ).join( __dirname, ".boxen" ), true, true );

} catch ( error ) {
    require( "properjs-lager" ).error( "Boxen config parse error!" );
    throw error;
    process.exit();
}

module.exports = config;
