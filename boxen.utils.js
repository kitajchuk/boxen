const fs = require( "fs" );
const path = require( "path" );



module.exports = {
    read ( path, sync, json ) {
        if ( sync ) {
            return json ? JSON.parse( String( fs.readFileSync( path ) ) ) : String( fs.readFileSync( path ) );

        } else {
            return new Promise(( resolve, reject ) => {
                fs.readFile( path, ( error, data ) => {
                    if ( error ) {
                        reject( error );

                    } else {
                        resolve( json ? JSON.parse( String( data ) ) : data );
                    }
                });
            });
        }
    },

    write ( path, content, sync, json ) {
        if ( sync ) {
            return fs.writeFileSync( path, json ? JSON.stringify( content, null, 4 ) : content, "utf8" );

        } else {
            return new Promise(( resolve, reject ) => {
                fs.writeFile( path, json ? JSON.stringify( content, null, 4 ) : content, "utf8", ( error ) => {
                    if ( error ) {
                        reject( error );

                    } else {
                        resolve();
                    }
                });
            });
        }
    }
};
