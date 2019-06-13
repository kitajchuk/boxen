// import $ from "properjs-hobo";
const svgNpm = require( `../../../blocks/svg-npm.block` );
const svgTabi = require( `../../../blocks/svg-tabi.block` );



export default ( instance, link ) => {
    if ( instance.test.npm.test( link[ 0 ].href ) ) {
        link.addClass( "npm-unauth" );
    }

    if ( instance.test.tabi.test( link[ 0 ].href ) ) {
        link.addClass( "tabi-unauth" );
    }

    return `<div>
        ${instance.test.npm.test( link[ 0 ].href ) ? `${svgNpm}` : instance.test.tabi.test( link[ 0 ].href ) ? `${svgTabi}` : ``}
    </div>`;
};
