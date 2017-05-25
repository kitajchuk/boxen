import * as core from "../core";
import ImageController from "./ImageController";
import AnimateController from "./AnimateController";
import CoverController from "./CoverController";
import QueryController from "./QueryController";


/**
 *
 * @public
 * @global
 * @class Controllers
 * @classdesc Handle controller functions.
 *
 */
class Controllers {
    constructor () {}


    exec () {
        this.images = core.dom.main.find( core.config.lazyImageSelector );
        this.animates = core.dom.main.find( core.config.animSelector );
        this.cover = core.dom.main.find( core.config.coverSelector );

        if ( this.animates.length ) {
            this.animateController = new AnimateController( this.animates );
        }

        this.imageController = new ImageController( this.images );
        this.imageController.on( "preloaded", () => {
            core.emitter.fire( "app--intro-teardown" );
        });

        if ( this.cover.length ) {
            this.coverController = new CoverController( this.cover );
        }

        this.queryController = new QueryController();
    }


    destroy () {
        if ( this.imageController ) {
            this.imageController.destroy();
            this.imageController = null;
        }

        if ( this.animateController ) {
            this.animateController.destroy();
            this.animateController = null;
        }

        if ( this.coverController ) {
            this.coverController.destroy();
            this.coverController = null;
        }

        if ( this.queryController ) {
            this.queryController.destroy();
            this.queryController = null;
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Controllers;
