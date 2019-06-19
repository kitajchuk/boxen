import $ from "properjs-hobo";
import PageController from "properjs-pagecontroller";
import Controllers from "./Controllers";
import * as core from "./core";
import navi from "./modules/navi";



/**
 *
 * @public
 * @namespace router
 * @description Uses ProperJS PageController for client-side router management.
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
        this.element = core.dom.body.find( ".js-router" ).detach();
        this.animDuration = 500;
        this.controllers = new Controllers({
            el: core.dom.main,
            cb: () => {
                this.topper();
            }
        });

        // Transition page state stuff
        this.state = {
            now: null,
            future: null
        };

        this.bindEmpty();

        core.log( "[Router initialized]", this );
    },


    load () {
        return new Promise(( resolve, reject ) => {
            this._resolve = resolve;
            this._reject = reject;
            this.controller = new PageController({
                transitionTime: this.animDuration,
                routerOptions: {
                    async: true
                }
            });

            this.controller.setConfig([
                "/",
                ":view",
                ":view/:uid",
                ":view/:uid/:uid2"
            ]);

            // this.controller.setModules( [] );

            //this.controller.on( "page-controller-router-samepage", () => {} );
            this.controller.on( "page-controller-router-transition-out", this.changePageOut.bind( this ) );
            this.controller.on( "page-controller-router-refresh-document", this.changeContent.bind( this ) );
            this.controller.on( "page-controller-router-transition-in", this.changePageIn.bind( this ) );
            this.controller.on( "page-controller-initialized-page", ( data ) => {
                this.initPage( data );
            });
            this.controller.initPage();
        });
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
     * @method initPage
     * @param {object} data The PageController data object
     * @memberof router
     * @description Cache the initial page load.
     *
     */
    initPage ( data ) {
        if ( data.status === 404 ) {
            core.dom.html.addClass( "is-404-page" );
        }

        this.setDoc( data );
        this.setState( "now", data );
        this.setState( "future", data );
        this.setClass();
        navi.setActive( this.state.now.view );
        core.dom.main[ 0 ].innerHTML = this.doc.html;
        this.topper();
        this.controllers.exec();
        setTimeout(() => {
            this._resolve();

        }, 1000 );
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
        let virtual = null;

        doc.innerHTML = html;

        doc = $( doc );
        virtual = doc.find( ".js-router" );

        // Parse outside of virtual DOM ( SQS config stuff for block overrides )
        virtual.find( ".js-sqs-config-style" ).remove();
        virtual.find( ".js-sqs-config-image" ).remove();

        return {
            doc: doc,
            virtual: virtual,
            html: virtual[ 0 ].innerHTML,
            data: virtual.data()
        };
    },


    setDoc ( data ) {
        this.doc = this.parseDoc( data.response );
    },


    setState ( time, data ) {
        this.state[ time ] = {
            raw: data && data || null,
            uid: data && data.request.params.uid || null,
            uid2: data && data.request.params.uid2 || null,
            view: data && data.request.params.view || core.config.homepage,
            cat: data && data.request.query.category || null,
            tag: data && data.request.query.tag || null
        };
    },


    setClass () {
        if ( this.state.future.view ) {
            core.dom.html.addClass( `is-${this.state.future.view}-page` );
        }

        if ( this.state.future.uid ) {
            core.dom.html.addClass( `is-uid-page` );
        }

        if ( this.state.future.uid2 ) {
            core.dom.html.addClass( `is-uid2-page` );
        }

        if ( this.state.future.cat ) {
            core.dom.html.addClass( `is-cat-page` );
        }

        if ( this.state.future.tag ) {
            core.dom.html.addClass( `is-tag-page` );
        }
    },


    unsetClass () {
        core.dom.html.removeClass( "is-404-page" );

        if ( this.state.now.view !== this.state.future.view ) {
            core.dom.html.removeClass( `is-${this.state.now.view}-page` );
        }

        if ( this.state.now.uid && !this.state.future.uid ) {
            core.dom.html.removeClass( `is-uid-page` );
        }

        if ( this.state.now.uid2 && !this.state.future.uid2 ) {
            core.dom.html.removeClass( `is-uid2-page` );
        }

        if ( this.state.now.cat && !this.state.future.cat ) {
            core.dom.html.removeClass( `is-cat-page` );
        }

        if ( this.state.now.tag && !this.state.future.tag ) {
            core.dom.html.removeClass( `is-tag-page` );
        }
    },


    changePageOut ( data ) {
        core.dom.html.addClass( "is-tranny" );
        this.setState( "future", data );
        navi.setActive( this.state.future.view );
        navi.close();
    },


    changeContent ( data ) {
        this.controllers.destroy();
        this.setDoc( data );
        this.unsetClass();
        this.setClass();
        this.setState( "now", data );
        core.dom.main[ 0 ].innerHTML = this.doc.html;
        this.topper();
        this.controllers.exec();
        core.emitter.fire( "app--tracker", this.doc );
    },


    changePageIn ( /*data*/ ) {
        setTimeout(() => {
            core.dom.html.removeClass( "is-tranny" );

        }, this.animDuration );
    },


    route ( path ) {
        this.controller.getRouter().trigger( path );
    },


    push ( path, cb ) {
        this.controller.routeSilently( path, (cb || core.util.noop) );
    },


    topper () {
        window.scrollTo( 0, 0 );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default router;
