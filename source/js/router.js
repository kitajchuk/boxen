import $ from "properjs-hobo";
import PageController from "properjs-pagecontroller";
import Controllers from "./class/Controllers";
import * as core from "./core";
import navi from "./navi";


/**
 *
 * @public
 * @namespace router
 * @description Handles async web app routing for nice transitions.
 *
 */
const router = {
    /**
     *
     * @public
     * @method init
     * @memberof router
     * @description Initialize the router module.
     *
     */
    init () {
        this.pageClass = "";
        this.pageDuration = core.util.getElementDuration( core.dom.html[ 0 ] );
        this.controllers = new Controllers({
            el: core.dom.main,
            cb: () => {
                core.emitter.fire( "app--page-teardown" );
            }
        });
        this.bindEmpty();
        this.initPages();

        core.emitter.on( "app--page-teardown", () => this.topper() );

        core.log( "[Router initialized]", this );
    },


    /**
     *
     * @public
     * @method bindEmpty
     * @memberof router
     * @description Suppress #hash links.
     *
     */
    bindEmpty () {
        core.dom.body.on( "click", "[href^='#']", ( e ) => e.preventDefault() );
    },


    /**
     *
     * @public
     * @method initPages
     * @memberof router
     * @description Create the PageController instance.
     *
     */
    initPages () {
        this.controller = new PageController({
            transitionTime: this.pageDuration
        });

        this.controller.setConfig([
            "/",
            ":view",
            ":view/:uid"
        ]);

        // this.controller.setModules( [] );

        this.controller.on( "page-controller-initialized-page", this.initPage.bind( this ) );
        //this.controller.on( "page-controller-router-samepage", () => {} );
        this.controller.on( "page-controller-router-transition-out", this.changePageOut.bind( this ) );
        this.controller.on( "page-controller-router-refresh-document", this.changeContent.bind( this ) );
        this.controller.on( "page-controller-router-transition-in", this.changePageIn.bind( this ) );

        this.controller.initPage();
    },


    /**
     *
     * @public
     * @method initPage
     * @param {object} data The PageController data object
     * @memberof router
     * @description Cache the initial page load.
     *
     */
    initPage ( data ) {
        this.changeClass( data );
        this.controllers.exec();
    },


    /**
     *
     * @public
     * @method parseDoc
     * @param {string} html The responseText to parse out
     * @memberof router
     * @description Get the DOM information to cache for a request.
     * @returns {object}
     *
     */
    parseDoc ( html ) {
        let doc = document.createElement( "html" );
        let main = null;

        doc.innerHTML = html;

        doc = $( doc );
        main = doc.find( core.config.mainSelector );

        return {
            doc: doc,
            main: main,
            html: main[ 0 ].innerHTML,
            data: main.data()
        };
    },


    /**
     *
     * @public
     * @method changeClass
     * @param {object} data The PageController data object
     * @memberof router
     * @description Handle document className swapping by page section.
     *
     */
    changeClass ( data ) {
        if ( this.view ) {
            core.dom.html.removeClass( `is-${this.view}-page is-uid-page` );
        }

        if ( this.uid ) {
            core.dom.html.removeClass( "is-uid-page" );
        }

        this.view = (data.request.params.view || core.config.homepage);
        this.uid = (data.request.params.uid || null);

        core.dom.html.addClass( `is-${this.view}-page` );

        if ( this.uid ) {
            core.dom.html.addClass( "is-uid-page" );
        }

        navi.active( this.view );
    },


    /**
     *
     * @public
     * @method changePageOut
     * @param {object} data The PageController data object
     * @memberof router
     * @description Trigger transition-out animation.
     *
     */
    changePageOut ( /* data */ ) {
        this.controllers.destroy();
        navi.close();
    },


    /**
     *
     * @public
     * @method changeContent
     * @param {object} data The PageController data object
     * @memberof router
     * @description Swap the new content into the DOM.
     *
     */
    changeContent ( data ) {
        const doc = this.parseDoc( data.response );

        core.dom.main[ 0 ].innerHTML = doc.html;

        core.emitter.fire( "app--analytics-pageview", doc );

        // Ensure topout prior to preload being done...
        this.topper();

        this.changeClass( data );
    },


    /**
     *
     * @public
     * @method changePageIn
     * @param {object} data The PageController data object
     * @memberof router
     * @description Trigger transition-in animation.
     *
     */
    changePageIn ( /* data */ ) {
        this.controllers.exec();
        this.execSquarespace();

    },


    /**
     *
     * @public
     * @method route
     * @param {string} path The uri to route to
     * @memberof router
     * @description Trigger app to route a specific page. [Reference]{@link https://github.com/ProperJS/Router/blob/master/Router.js#L222}
     *
     */
    route ( path ) {
        this.controller.getRouter().trigger( path );
    },


    /**
     *
     * @public
     * @method push
     * @param {string} path The uri to route to
     * @param {function} cb Optional callback to fire
     * @memberof router
     * @description Trigger a silent route with a supplied callback.
     *
     */
    push ( path, cb ) {
        this.controller.routeSilently( path, (cb || core.util.noop) );
    },


    /**
     *
     * @public
     * @method topper
     * @memberof router
     * @description Set scroll position and clear scroll classNames.
     *
     */
    topper () {
        window.scrollTo( 0, 0 );
    },


    // Initialize core sqs blocks after ajax routing
    execSquarespace () {
        setTimeout(() => {
            window.Squarespace.initializeVideo( window.Y );
            window.Squarespace.initializeCommerce( window.Y );
            window.Squarespace.initializeFormBlocks( window.Y, window.Y );
            window.Squarespace.initializeLayoutBlocks( window.Y );
            window.Squarespace.initializeSummaryV2Block( window.Y );

        }, 0 );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default router;
