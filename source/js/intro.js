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
        core.emitter.on( "app--intro-teardown", this.teardown.bind( this ) );
    },


    teardown () {
        setTimeout( () => {
            core.dom.intro.removeClass( "is-active" );

        }, 1000 );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default intro;
