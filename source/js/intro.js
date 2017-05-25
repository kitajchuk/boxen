import * as core from "./core";


/**
 *
 * @public
 * @namespace intro
 * @description Performs the branded load-in screen sequence.
 * @memberof menus
 *
 */
const intro = {
    /**
     *
     * @public
     * @method init
     * @memberof menus.intro
     * @description Method initializes intro node in DOM.
     *
     */
    init () {
        this.element = core.dom.intro;
        this.duration = 2000;
        core.emitter.on( "app--intro-teardown", this.teardown.bind( this ) );
    },


    teardown () {
        setTimeout( () => {
            this.element.removeClass( "is-active" );

        }, this.duration );

        setTimeout( () => {
            this.element.remove();

        }, (this.duration + core.util.getTransitionDuration( this.element[ 0 ] )) );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default intro;
