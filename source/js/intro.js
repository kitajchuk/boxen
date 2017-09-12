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
        this.logo = this.element.find( ".js-intro-logo" );
        core.emitter.on( "app--page-teardown", this.teardown );
    },


    teardown () {
        core.emitter.off( "app--page-teardown", intro.teardown );

        intro.logo.on( "animationend", () => {
            intro.element.removeClass( "is-active" );
        });

        intro.element.on( "transitionend", () => {
            intro.element.remove();

            core.emitter.fire( "app--intro-teardown" );
        });
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default intro;
