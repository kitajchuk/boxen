import * as core from "../core";
import Controller from "properjs-controller";


/**
 *
 * @public
 * @global
 * @class CoverController
 * @param {Element} element The dom element to work with.
 * @classdesc Handle fullbleed cover image moments.
 *
 */
class CoverController extends Controller {
    constructor ( element ) {
        super();

        this.element = element;

        if ( this.element.length ) {
            this.start();
        }
    }


    /**
     *
     * @instance
     * @description Initialize the animation frame
     * @memberof CoverController
     * @method start
     *
     */
    start () {
        // Call on parent cycle
        this.go(() => {
            if ( core.util.isElementVisible( this.element[ 0 ] ) ) {
                core.dom.html.addClass( "is-cover" ).removeClass( "is-cover--less" );

            } else {
                core.dom.html.removeClass( "is-cover" ).addClass( "is-cover--less" );
            }
        });
    }


    /**
     *
     * @instance
     * @description Stop the animation frame
     * @memberof CoverController
     * @method destroy
     *
     */
    destroy () {
        core.dom.html.removeClass( "is-cover is-cover--less" );

        this.stop();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default CoverController;
