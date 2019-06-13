import * as core from "../core";
// import Controller from "properjs-controller";


/**
 *
 * @public
 * @namespace intro
 * @description Performs the branded load-in screen sequence.
 *
 */
const intro = {
    init () {
        this.element = core.dom.body.find( ".js-intro" );
    },


    teardown () {
        this.element.removeClass( "is-active" );
        core.emitter.fire( "app--intro-teardown" );

        setTimeout(() => {
            this.element[ 0 ].style.display = "none";

        }, 500 );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default intro;
