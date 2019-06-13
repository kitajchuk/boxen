import * as core from "../core";
import $ from "properjs-hobo";
import paramalama from "paramalama";


/**
 *
 * @public
 * @global
 * @class View
 * @param {Element} element The view element to render into
 * @classdesc Handle shared view functionality.
 *
 */
class View {
    constructor ( element ) {
        this.element = element;
        this.data = this.element.data();
        this.uid = this.data.uid;
        this.url = this.data.url;
        this.component = this.data.component;
        this.json = null;

        this.init();
    }


    init () {
        this.load().then( ( json ) => {
            this.json = json;
            this.render();
            this.exec();
            this.done();
        });
    }


    done () {}


    load () {
        // const cache = core.cache.get( `view--${this.uid}` );
        const query = paramalama( window.location.search );

        // Set these for Squarespace API JSON fetching
        query.format = "json";
        query.timestamp = Date.now();

        return $.ajax({
            url: this.url,
            dataType: "json",
            method: "GET",
            data: query
        });
    }


    render () {
        // Webpack es6Module { __esModule: true, default: f }
        const view = require( `../../views/${this.uid}` );

        this.element[ 0 ].innerHTML = view.default( this );
    }


    exec () {
        this.imageLoader = core.util.loadImages(
            this.element.find( core.config.lazyImageSelector ),
            core.util.noop
        );

        if ( this.component ) {
            // Webpack es6Module { __esModule: true, default: f }
            const component = require( `./${this.component}` );

            this.instance = new component.default( this );
        }
    }


    destroy () {
        if ( this.instance ) {
            this.instance.destroy();
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default View;
