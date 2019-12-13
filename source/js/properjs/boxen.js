// Load the SASS
require( "../../sass/screen.scss" );



// Load the JS
// import Store from "./core/Store";
import ResizeController from "properjs-resizecontroller";
import ScrollController from "properjs-scrollcontroller";
import debounce from "properjs-debounce";
import router from "./router";
import * as core from "./core";
import Metrics from "./services/Metrics";
import Form from "./services/Form";
import Socials from "./components/Socials";
import intro from "./modules/intro";
import navi from "./modules/navi";
import Controllers from "./Controllers";



/**
 *
 * @public
 * @class Boxen
 * @classdesc Main Boxen ProperJS Application.
 *
 */
class Boxen {
    constructor () {
        // this.Store = Store;
        this.core = core;
        this.intro = intro;
        this.navi = navi;
        this.router = router;
        this.metrics = new Metrics();
        this.resizer = new ResizeController();
        this.scroller = new ScrollController();
        this.scrollBounce = 300;
        this.scrollTimeout = null;
        this.socials = [];
        this.controllers = new Controllers({
            el: core.dom.main
        });

        this.boot();
    }


    boot () {
        this.intro.init();
        this.navi.init();
        this.router.init().load().then(() => {
            this.bind();
            this.init();

        }).catch(( error ) => {
            this.core.log( "warn", error );
        });

        // Global components
        const socials = core.dom.body.find( `.sqs-block-socialaccountlinks-v2` );
        const newsletter = core.dom.footer.find( `.js-form[data-block="newsletter"]` );

        if ( socials.length ) {
            socials.forEach(( el, i ) => {
                const social = socials.eq( i );

                this.socials.push( new Socials( social, social.data() ) );
            });
        }

        if ( newsletter.length ) {
            this.newsletter = new Form( newsletter, newsletter.data() );
        }
    }


    init () {
        this.intro.teardown();
    }


    bind () {
        // RESIZE
        this._onResize = debounce(() => {
            this.core.emitter.fire( "app--resize" );

        }, this.deBounce );

        this.resizer.on( "resize", this._onResize );

        // SCROLL
        this.scroller.on( "scroll", () => {
            core.emitter.fire( "app--scroll", this.scroller.getScrollY() );

            core.dom.html.addClass( "is-scrolling" );

            clearTimeout( this.scrollTimeout );

            this.scrollTimeout = setTimeout(() => {
                core.dom.html.removeClass( "is-scrolling" );

            }, this.scrollBounce );
        });

        this.scroller.on( "scrollup", () => {
            core.dom.html.removeClass( "is-scroll-down" ).addClass( "is-scroll-up" );
            core.emitter.fire( "app--scrollup", this.scroller.getScrollY() );
        });

        this.scroller.on( "scrolldown", () => {
            const scrollY = this.scroller.getScrollY();

            if ( scrollY > 0 ) {
                core.dom.html.removeClass( "is-scroll-up" ).addClass( "is-scroll-down" );
                core.emitter.fire( "app--scrolldown", this.scroller.getScrollY() );
            }
        });

        // TWEAKS
        window.Y.Global.on( "tweak:change", () => {
            window.location.reload();
        });

        window.Y.Global.on( "tweak:reset", () => {
            window.location.reload();
        });
    }
}


// Create {boxen} instance
window.boxen = new Boxen();


// Export {app} instance
export default window.boxen;
