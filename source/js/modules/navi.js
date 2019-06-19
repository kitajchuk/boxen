import * as core from "../core";


/**
 *
 * @public
 * @namespace navi
 * @description Open tray, activate links.
 * @memberof menus
 *
 */
const navi = {
    init () {
        this.nav = core.dom.body.find( ".js-navi" );
        this.navItems = core.dom.body.find( ".js-navi-a" );
        this.main = core.dom.main;
        this.header = core.dom.body.find( ".js-header" );
        this.trigger = this.header.find( ".js-navi-trigger" );
        this.isOpen = false;
        this.bind();
    },


    bind () {
        this.trigger.on( "click", () => {
            if ( this.isOpen ) {
                this.close();

            } else {
                this.open();
            }
        });

        core.emitter.on( "app--scrollup", this.onScrollUp.bind( this ) );
        core.emitter.on( "app--scrolldown", this.onScrollDown.bind( this ) );
    },


    open () {
        this.isOpen = true;
        core.dom.html.addClass( "is-navi-mobile" );
    },


    close () {
        this.isOpen = false;
        core.dom.html.removeClass( "is-navi-mobile" );
    },


    onScrollUp ( scrollY ) {
        this.handleScroll( scrollY );
    },


    onScrollDown ( scrollY ) {
        this.handleScroll( scrollY );
    },


    handleScroll ( scrollY ) {
        if ( scrollY > 0 ) {
            core.dom.html.addClass( "is-header-small" );

        } else {
            core.dom.html.removeClass( "is-header-small" );
        }
    },


    setActive ( view ) {
        this.navItems.removeClass( "is-active" );
        this.navItems.filter( `.js-navi--${view}` ).addClass( "is-active" );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default navi;
