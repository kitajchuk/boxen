import * as core from "./core";
import debounce from "properjs-debounce";
import ImageController from "./controllers/ImageController";
import BaseController from "./controllers/BaseController";
import Slider from "./components/Slider";
import Video from "./components/Video";
import Socials from "./components/Socials";
import Form from "./services/Form";
import Search from "./services/Search";
import Commerce from "./services/Commerce";



/**
 *
 * @public
 * @global
 * @class Controllers
 * @classdesc Handle controller functions.
 * @param {object} options Optional config
 *
 */
class Controllers {
    constructor ( options ) {
        this.element = options.el;
        this.callback = options.cb;
        this.controllers = [];
        this.resizeBounce = 300;
    }


    push ( id, elements, controller, component ) {
        this.controllers.push({
            id,
            elements,
            instance: null,
            Controller: controller,
            component
        });
    }


    init () {
        this.controllers.forEach(( controller ) => {
            if ( controller.elements.length ) {
                controller.instance = new controller.Controller(
                    controller.elements,
                    controller.component
                );
            }
        });
    }


    kill () {
        this.controllers.forEach(( controller ) => {
            if ( controller.instance ) {
                controller.instance.destroy();
            }
        });

        this.controllers = [];
    }


    exec () {
        this.controllers = [];

        this.push( "slider", this.element.find( ".js-slider" ), BaseController, Slider );
        this.push( "forms", this.element.find( ".js-form" ), BaseController, Form );
        this.push( "search", this.element.find( ".js-search, .sqs-search-page" ), BaseController, Search );
        this.push( "commerce", this.element.find( ".js-shop, .js-product, #sqs-cart-root" ), BaseController, Commerce );

        // Hinge on Squarespace selectors...
        this.push( "video", this.element.find( ".sqs-block-video" ), BaseController, Video );
        this.push( "socials", this.element.find( ".sqs-block-socialaccountlinks-v2" ), BaseController, Socials );

        this.init();

        this.images = this.element.find( core.config.lazyImageSelector );
        this.imageController = new ImageController( this.images );
        this.imageController.on( "preloaded", () => {
            if ( this.callback ) {
                this.callback();
            }
        });

        this.__appResize = debounce(() => {
            this.images.removeAttr( core.config.imageLoaderAttr );
            this.imageController.destroy();
            this.imageController = new ImageController( this.images );

        }, this.resizeBounce );

        core.emitter.on( "app--resize", this.__appResize );
    }


    destroy () {
        core.emitter.off( "app--resize", this.__appResize );

        if ( this.imageController ) {
            this.imageController.destroy();
        }

        this.kill();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Controllers;
