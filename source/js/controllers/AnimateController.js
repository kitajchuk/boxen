// import Stagger from "properjs-stagger";
// import ScrollController from "properjs-scrollcontroller";
import * as core from "../core";
import Controller from "properjs-controller";


/**
 *
 * @public
 * @global
 * @class AnimateController
 * @param {Element} element The dom element to work with.
 * @classdesc Handle scroll events for a DOMElement.
 *
 */
class AnimateController {
    constructor ( container ) {
        this.container = container;
        this.elements = [];
    }


    start () {
        this.watcher = new Controller();
        this.watcher.go(() => {
            this.elements = this.container.find( core.config.lazyAnimSelector ).not( "[data-animate='true']" );

            if ( !this.elements.length ) {
                this.watcher.stop();
                this.watcher = null;

                core.log( "[AnimateController] Done!" );

            } else {
                this.elements.forEach(( el, i ) => {
                    const elem = this.elements.eq( i );

                    if ( core.util.isElementVisible( el ) ) {
                        elem.attr( "data-animate", "true" ).addClass( "is-animated" );
                    }
                });
            }
        });
    }


    destroy () {
        if ( this.watcher ) {
            this.watcher.stop();
            this.watcher = null;
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default AnimateController;
