import * as core from "../core";
// import $ from "properjs-hobo";
// import { TweenLite, Power3 } from "gsap/TweenMax";
import ResizeController from "properjs-resizecontroller";
import ScrollController from "properjs-scrollcontroller";


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
        this.resizer = new ResizeController();
        this.scroller = new ScrollController();
        this.isOpen = false;
        this.bind();
        this.onResize();
    },


    bind () {
        this.resizer.on( "resize", this.onResize.bind( this ) );
        this.scroller.on( "scrollup", this.onScrollUp.bind( this ) );
        this.scroller.on( "scrolldown", this.onScrollDown.bind( this ) );

        this.trigger.on( "click", () => {
            if ( this.isOpen ) {
                this.close();

            } else {
                this.open();
            }
        });
    },


    open () {
        this.isOpen = true;
        core.dom.html.addClass( "is-navi-mobile" );
    },


    close () {
        this.isOpen = false;
        core.dom.html.removeClass( "is-navi-mobile" );
    },


    onResize () {},


    onScrollUp () {
        const scrollY = this.scroller.getScrollY();

        if ( scrollY < 0 ) {
            core.log( "warn", "negative scroll margin at the top" );
            core.dom.html.removeClass( "is-scroll-down is-scroll-up" );

        } else {
            core.dom.html.removeClass( "is-scroll-down" ).addClass( "is-scroll-up" );
            this.handleScroll();
        }

        // console.log( "onScrollUp", this.scroller.getScrollY(), this.scroller.getScrollMax(), this.scroller.isScrollMax() );
    },


    onScrollDown () {
        if ( this.scroller.isScrollMax() ) {
            core.log( "warn", "nuclear scroll margin at the bottom" );
            core.dom.html.removeClass( "is-scroll-up" ).addClass( "is-scroll-down" );

        } else {
            core.dom.html.removeClass( "is-scroll-up" ).addClass( "is-scroll-down" );
            this.handleScroll();
        }

        // console.log( "onScrollDown", this.scroller.getScrollY(), this.scroller.getScrollMax(), this.scroller.isScrollMax() );
    },


    handleScroll () {
        const scrollY = this.scroller.getScrollY();

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
