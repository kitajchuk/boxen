// Load the SASS
require( "../sass/screen.scss" );



// Load the JS
import $ from "properjs-hobo";
import router from "./router";
import * as core from "./core";
import Metrics from "./services/Metrics";
import intro from "./modules/intro";
import navi from "./modules/navi";



/**
 *
 * @public
 * @class Boxen
 * @classdesc Main Boxen ProperJS Application.
 *
 */
class Boxen {
    constructor () {
        this.metrics = new Metrics();
        this.core = core;
        this.intro = intro;
        this.navi = navi;
        this.router = router;
        this.$ = $;

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
