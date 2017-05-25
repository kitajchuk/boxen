import * as core from "../core";
import paramalama from "paramalama";


/**
 *
 * @public
 * @global
 * @class QueryController
 * @classdesc Handle classNames mapped from ?querystring.
 *
 */
class QueryController {
    constructor () {
        if ( window.location.search ) {
            this.query();
        }
    }


    query () {
        this.params = paramalama( window.location.search );
        this.classNames = ["is-query"];

        // Gather classNames for query params
        // Stuff like ?category=foo&tag=bar
        for ( const prop in this.params ) {
            if ( this.params.hasOwnProperty( prop ) ) {
                this.classNames.push( `is-query--${prop}` );
            }
        }

        core.dom.html.addClass( this.classNames.join( " " ) );
    }


    /**
     *
     * @instance
     * @description Remove the classNames
     * @memberof QueryController
     * @method destroy
     *
     */
    destroy () {
        if ( this.params ) {
            core.dom.html.removeClass( this.classNames.join( " " ) );
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default QueryController;
