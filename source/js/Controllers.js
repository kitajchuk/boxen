import * as core from "./core";
import debounce from "properjs-debounce";
import ResizeController from "properjs-resizecontroller";
import ImageController from "./controllers/ImageController";
import BaseController from "./controllers/BaseController";
// import Newsletter from "./services/Newsletter";
// import Search from "./services/Search";
// import Commerce from "./services/Commerce";
// import Video from "./components/Video";
// import Audio from "./components/Audio";
// import Slider from "./components/Slider";
// import Issue from "./components/Issue";
import Socials from "./components/Socials";
import Form from "./services/Form";



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

        // this.push( "issue", this.element.find( ".js-issue" ), BaseController, Issue );
        // this.push( "newsletter", this.element.find( ".js-newsletter" ), BaseController, Newsletter );
        // this.push( "search", this.element.find( ".js-search" ), BaseController, Search );
        // this.push( "audio", this.element.find( ".js-audio" ), BaseController, Audio );
        // this.push( "slider", this.element.find( ".js-slider" ), BaseController, Slider );
        // this.push( "commerce", this.element.find( ".js-shop, .js-product, #sqs-cart-root" ), BaseController, Commerce );
        this.push( "forms", core.dom.body.find( ".js-form" ), BaseController, Form );

        // Hinge on Squarespace selectors...
        // this.push( "video", this.element.find( ".sqs-block-video" ), BaseController, Video );
        this.push( "socials", core.dom.body.find( ".sqs-block-socialaccountlinks-v2" ), BaseController, Socials );

        this.init();

        this.images = this.element.find( core.config.lazyImageSelector );
        this.imageController = new ImageController( this.images );
        this.imageController.on( "preloaded", () => {
            if ( this.callback ) {
                this.callback();
            }
        });

        this.resizeController = new ResizeController();
        this.resizeController.on( "resize", debounce(() => {
            this.images.removeAttr( core.config.imageLoaderAttr );
            this.imageController.destroy();
            this.imageController = new ImageController( this.images );

        }, this.resizeBounce ));
    }


    destroy () {
        if ( this.imageController ) {
            this.imageController.destroy();
        }

        if ( this.resizeController ) {
            this.resizeController.destroy();
        }

        this.kill();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Controllers;
