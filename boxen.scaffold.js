const fs = require( "fs" );
const path = require( "path" );
const root = __dirname;
const child_process = require( "child_process" );
const lager = require( "properjs-lager" );
const config = require( "./boxen.config" );
const utils = require( "./boxen.utils" );
const siteBuildPath = path.join( __dirname, "build", "site.region" );
const siteBuildRegion = utils.read( siteBuildPath, true );
const siteFooters = "{squarespace-footers}";
const entryPoints = [];
const siteReplacements = [
    `        ${siteFooters}`
];



for ( let module in config.webpack.entry ) {
    if ( module !== "boxen" && config.webpack.entry.hasOwnProperty( module ) ) {
        lager.server( `Scaffold entry, ${siteFooters}:${module}` );

        entryPoints.push(
            `<script src="/scripts/${module}.js?v={squarespace.template-revision}"></script>`
        );
    }
}



if ( entryPoints.length ) {
    utils.write(
        siteBuildPath,
        siteBuildRegion.replace( siteFooters, siteReplacements.concat( entryPoints ).reverse().join( "\n" ) ),
        true
    );

} else {
    lager.server( `Scaffold no entries found` );
}
