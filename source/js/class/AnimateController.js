import Controller from "properjs-controller";
import * as core from "../core";


/**
 *
 * @public
 * @global
 * @class AnimateController
 * @param {Element} element The dom element to work with.
 * @classdesc Handle scroll events for a DOMElement.
 *
 */
class AnimateController extends Controller {
    constructor ( elements ) {
        super();

        this.elements = elements;

        this.start();
    }


    /**
     *
     * @instance
     * @description Initialize the animation frame
     * @memberof AnimateController
     * @method start
     *
     */
    start () {
        // Call on parent cycle
        this.go(() => {
            this.elements.forEach(( element, i ) => {
                if ( core.util.isElementVisible( element ) ) {
                    this.elements.eq( i ).addClass( "is-animate" );

                } else {
                    this.elements.eq( i ).removeClass( "is-animate" );
                }
            });
        });
    }


    /**
     *
     * @instance
     * @description Stop the animation frame
     * @memberof AnimateController
     * @method destroy
     *
     */
    destroy () {
        this.stop();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default AnimateController;
