import * as core from "../core";



/**
 *
 * @public
 * @namespace intro
 * @description Performs the branded load-in screen sequence.
 *
 */
const intro = {
    init () {},


    teardown () {
        core.dom.intro.removeClass( "is-active" );

        setTimeout(() => {
            core.emitter.fire( "app--intro" );
            core.dom.html.removeClass( "is-site-intro" );

        }, core.config.defaultDuration );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default intro;
