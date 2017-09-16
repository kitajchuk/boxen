import * as core from "../core";
import ImageController from "./ImageController";
import AnimateController from "./AnimateController";
import CoverController from "./CoverController";
import QueryController from "./QueryController";
import CarouselController from "./CarouselController";
import FormController from "./FormController";


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
    }


    push ( id, elements, controller, conditions ) {
        this.controllers.push({
            id: id,
            elements: elements,
            instance: null,
            Controller: controller,
            conditions: conditions
        });
    }


    init () {
        this.controllers.forEach(( controller ) => {
            if ( controller.elements.length && controller.conditions ) {
                controller.instance = new controller.Controller( controller.elements );
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

        this.push( "animate", this.element.find( core.config.animSelector ), AnimateController, true );
        this.push( "cover", this.element.find( core.config.coverSelector ), CoverController, true );
        this.push( "carousel", this.element.find( core.config.carouselSelector ), CarouselController, true );
        this.push( "form", core.dom.body.find( core.config.formSelector ), FormController, true );
        this.push( "query", ["q"], QueryController, true );

        this.images = this.element.find( core.config.lazyImageSelector );
        this.imageController = new ImageController( this.images );
        this.imageController.on( "preloaded", () => {
            this.init();

            if ( this.callback ) {
                this.callback();
            }
        });
    }


    destroy () {
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
