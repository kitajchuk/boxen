const fs = require( "fs" );
const path = require( "path" );
const root = __dirname;
const rootNodeModules = path.join( root, "node_modules" );
const rootHobo = path.join( rootNodeModules, "properjs-hobo" );
const child_process = require( "child_process" );
const config = require( "./boxen.config" );



child_process.execSync( `cd ${rootHobo} && npm install && npm run build -- '${config.properjs.hobo}'` );
