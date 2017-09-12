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
        this.coverType = this.element.data( "cover" ) || "default";
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
            if ( core.util.isElementVisible( this.element[ 0 ] ) && !this.isActive ) {
                this.isActive = true;
                core.dom.html.addClass( `is-cover is-cover--${this.coverType}` );
                core.log( `[CoverController::Activate ${this.coverType}]` );

            } else if ( !core.util.isElementVisible( this.element[ 0 ] ) && this.isActive ) {
                this.isActive = false;
                core.dom.html.removeClass( `is-cover is-cover--${this.coverType}` );
                core.log( `[CoverController::Deactivate ${this.coverType}]` );
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
        core.dom.html.removeClass( `is-cover is-cover--${this.coverType}` );

        this.stop();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default CoverController;
