// Load the SASS
require( "../sass/screen.scss" );



// Load the JS
import ResizeController from "properjs-resizecontroller";
import ScrollController from "properjs-scrollcontroller";
import router from "./router";
import * as core from "./core";
import Metrics from "./services/Metrics";
import Form from "./services/Form";
import Socials from "./components/Socials";
import intro from "./modules/intro";
import navi from "./modules/navi";
import Store from "./core/Store";



// Global components
const socials = core.dom.body.find( `.sqs-block-socialaccountlinks-v2` );
const newsletter = core.dom.footer.find( `.js-form[data-block="newsletter"]` );



/**
 *
 * @public
 * @class Boxen
 * @classdesc Main Boxen ProperJS Application.
 *
 */
class Boxen {
    constructor () {
        // Modules
        this.core = core;
        this.intro = intro;
        this.navi = navi;
        this.router = router;
        this.Store = Store;
        this.metrics = new Metrics();
        this.resizer = new ResizeController();
        this.scroller = new ScrollController();
        this.scrollBounce = 300;
        this.scrollTimeout = null;
        this.socials = [];

        this.boot();
        this.init();
    }


    boot () {
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
        this.core.detect.init();
        this.intro.init();
        this.navi.init();
        this.router.init();
        this.router.load().then(() => {
            this.bind();
            this.intro.teardown();

        }).catch(( error ) => {
            this.core.log( "warn", error );
        });
    }


    bind () {
        this.resizer.on( "resize", () => {
            core.emitter.fire( "app--resize" );
        });

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
