import * as core from "./core";


/**
 *
 * @public
 * @namespace navi
 * @description Performs the branded load-in screen sequence.
 * @memberof menus
 *
 */
const navi = {
    /**
     *
     * @public
     * @method init
     * @memberof menus.navi
     * @description Method initializes navi node in DOM.
     *
     */
    init () {
        this.isOpen = false;
        this.element = core.dom.navi;
        this.items = this.element.find( ".js-navi-a" );
        this.trigger = core.dom.body.find( ".js-controller--navi" );
        this.bind();
    },


    bind () {
        this.trigger.on( "click", () => {
            this.toggle();
        });
    },


    open () {
        this.isOpen = true;
        this.element.addClass( "is-active" );
        core.dom.html.addClass( "is-navi-open" );
    },


    close () {
        this.isOpen = false;
        this.element.removeClass( "is-active" );
        core.dom.html.removeClass( "is-navi-open" );
    },


    active ( view ) {
        this.items.removeClass( "is-active" );
        this.items.filter( `.js-navi--${view}` ).addClass( "is-active" );
    },


    toggle () {
        if ( this.isOpen ) {
            this.close();

        } else {
            this.open();
        }
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default navi;
