// Load the SASS
require( "../sass/screen.scss" );



// Load the JS
import $ from "properjs-hobo";
import router from "./router";
import * as core from "./core";
import Metrics from "./services/Metrics";
import Form from "./services/Form";
import Socials from "./components/Socials";
import intro from "./modules/intro";
import navi from "./modules/navi";



// Global components
const socials = core.dom.footer.find( `.sqs-block-socialaccountlinks-v2` );
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
        this.$ = $;

        // Services
        this.metrics = new Metrics();

        if ( socials.length ) {
            this.socials = new Socials( socials, socials.data() );
        }

        if ( newsletter.length ) {
            this.newsletter = new Form( newsletter, newsletter.data() );
        }

        // Initialize
        this.init();
    }


    init () {
        this.core.detect.init();
        this.intro.init();
        this.navi.init();
        this.router.init();
        this.router.load().then(() => {
            this.intro.teardown();

        }).catch(( error ) => {
            this.core.log( "warn", error );
        });
    }
}


// Create {boxen} instance
window.boxen = new Boxen();


// Export {app} instance
export default window.boxen;
