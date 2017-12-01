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
    constructor ( elements ) {
        super();

        this.elements = elements;
        this.isActive = false;

        this.start();
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
            let isCover = false;

            this.elements.forEach(( el ) => {
                const bounds = el.getBoundingClientRect();

                if ( bounds.top <= 0 && bounds.bottom > 0 ) {
                    isCover = true;
                }
            });

            if ( isCover && !this.isActive ) {
                this.isActive = true;
                core.dom.html.addClass( "is-cover-view" );

            } else if ( !isCover && this.isActive ) {
                this.isActive = false;
                core.dom.html.removeClass( "is-cover-view" );
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
        core.dom.html.removeClass( "is-cover-view" );
        this.stop();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default CoverController;
