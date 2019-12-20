import $ from "properjs-hobo";
import PageController from "properjs-pagecontroller";
import * as core from "./core";
import navi from "./modules/navi";
// import scroll2 from "properjs-scroll2";
// import Easing from "properjs-easing";
import boxen from "./boxen";



/**
 *
 * @public
 * @namespace router
 * @description Uses ProperJS PageController for client-side router management.
 *
 */
const router = {
    init () {
        this.element = core.dom.body.find( ".js-router" ).detach();
        this.classes = this.element.data().classes.split( " " );
        this.duration = 500;
        this.state = {
            now: null,
            future: null
        };
        this.tweakStates = [
            "boxen-left-navi"
        ];

        this.bindEmpty();

        core.log( "[Router initialized]", this );

        return this;
    },


    load () {
        return new Promise(( resolve, reject ) => {
            this._resolve = resolve;
            this._reject = reject;
            this.controller = new PageController({
                transitionTime: this.duration,
                routerOptions: {
                    async: true
                }
            });

            this.controller.setConfig([
                "/",
                ":level1",
                ":level1/:level2",
                ":level1/:level2/:level3"
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


    bindEmpty () {
        core.dom.body.on( "click", "[href^='#']", ( e ) => e.preventDefault() );
    },


    setTweaks ( /*data*/ ) {
        this.tweakStates.forEach(( tweakState ) => {
            if ( this.doc.virtual.is( `.${tweakState}` ) ) {
                core.dom.html.addClass( tweakState );
            }
        });
    },


    initPage ( data ) {
        if ( data.status === 404 ) {
            core.dom.html.addClass( "is-404-page" );
        }

        this.setDoc( data );
        this.setTweaks( data );
        this.setState( "now", data );
        this.setState( "future", data );
        this.setClass();
        navi.setActive( this.state.now.level1, this.state.now.level2, this.state.now.level3 );
        this.topper();
        this.parseConfig( core.dom.main );
        this.parseArticle( core.dom.main );
        this.parseImages( core.dom.main );
        boxen.controllers.exec();
        setTimeout(() => {
            this._resolve();

        }, 1000 );
    },


    parseDoc ( html ) {
        let doc = document.createElement( "html" );
        let virtual = null;

        doc.innerHTML = html;

        doc = $( doc );
        virtual = doc.find( ".js-main" );

        // Parse squarespace classes
        this.element = doc.find( ".js-router" );
        this.classes = this.element.data().classes.split( " " );

        // Parse outside of virtual DOM ( SQS config stuff for block overrides )
        this.parseConfig( virtual );
        this.parseArticle( virtual );
        this.parseImages( virtual );

        return {
            doc: doc,
            virtual: virtual,
            html: virtual[ 0 ].innerHTML,
            data: virtual.data()
        };
    },


    parseConfig ( virtual ) {
        virtual.find( ".js-sqs-config-style" ).remove();
        virtual.find( ".js-sqs-config-image" ).remove();
    },


    parseArticle ( virtual ) {
        const article = virtual.find( "article[data-item-id]" );

        if ( article.length ) {
            const articleData = article.data();
            const summaryGrid = virtual.find( ".sqs-block-summary-v2" );

            if ( summaryGrid.length ) {
                summaryGrid.find( `[data-item-id="${articleData.itemId}"]` ).remove();
            }
        }
    },


    parseImages ( virtual ) {
        const images = virtual.find( ".js-lazy-image" );

        images.forEach(( el, i ) => {
            const wrapper = document.createElement( "div" );
            const image = images.eq( i );
            const check = image.closest( ".js-slideshow-item, .js-slideshow-thumb, .js-slider-item" );

            if ( !check.length ) {
                const data = image.data();
                const dims = core.util.getOriginalDims( data.originalSize );
                const ratio = (dims.height / dims.width) * 100;

                el.parentNode.insertBefore( wrapper, el );

                wrapper.style.paddingBottom = `${ratio}%`;
                wrapper.className = "image-aspect";
                wrapper.appendChild( el );
            }
        });
    },


    freeParseImages ( element, htmlString ) {
        let virtual = document.createElement( "div" );

        virtual = $( virtual );
        virtual[ 0 ].innerHTML = htmlString;
        this.parseImages( virtual );
        element[ 0 ].innerHTML = virtual[ 0 ].innerHTML;
        virtual = null;
    },


    setDoc ( data ) {
        this.doc = this.parseDoc( data.response );
    },


    setState ( time, data ) {
        this.state[ time ] = {
            raw: data && data || null,
            level1: data && data.request.params.level1 || null,
            level2: data && data.request.params.level2 || null,
            level3: data && data.request.params.level3 || null,
            cat: data && data.request.query.category || null,
            tag: data && data.request.query.tag || null
        };
    },


    setClass () {
        if ( this.state.future.level1 ) {
            core.dom.html.addClass( `is-level1-page is-${this.state.future.level1}-page` );
        }

        if ( this.state.future.level2 ) {
            core.dom.html.addClass( `is-level2-page is-${this.state.future.level2}-page` );
        }

        if ( this.state.future.level3 ) {
            core.dom.html.addClass( `is-level3-page is-${this.state.future.level3}-page` );
        }

        if ( this.state.future.cat ) {
            core.dom.html.addClass( "is-cat-page" );
        }

        if ( this.state.future.tag ) {
            core.dom.html.addClass( "is-tag-page" );
        }

        if ( !this.state.future.level1 && !this.state.future.level2 && !this.state.future.level3 ) {
            core.dom.html.addClass( "is-home-page" );
        }

        if ( this.classes.indexOf( "collection-type-index" ) !== -1 ) {
            core.dom.html.addClass( "is-index-page" );
        }
    },


    unsetClass () {
        // Always kill possible 404s
        core.dom.html.removeClass( "is-404-page" );

        // Now vs Future
        if ( this.state.now.level1 ) {
            core.dom.html.removeClass( `is-${this.state.now.level1}-page` );
        }

        if ( this.state.now.level2 ) {
            core.dom.html.removeClass( `is-${this.state.now.level2}-page` );
        }

        if ( this.state.now.level3 ) {
            core.dom.html.removeClass( `is-${this.state.now.level3}-page` );
        }

        if ( !this.state.future.level1 ) {
            core.dom.html.removeClass( "is-level1-page" );
        }

        if ( !this.state.future.level2 ) {
            core.dom.html.removeClass( "is-level2-page" );
        }

        if ( !this.state.future.level3 ) {
            core.dom.html.removeClass( "is-level3-page" );
        }

        if ( !this.state.future.cat ) {
            core.dom.html.removeClass( "is-cat-page" );
        }

        if ( !this.state.future.tag ) {
            core.dom.html.removeClass( "is-tag-page" );
        }

        if ( this.state.future.level1 ) {
            core.dom.html.removeClass( "is-home-page" );
        }

        if ( this.classes.indexOf( "collection-type-index" ) === -1 ) {
            core.dom.html.removeClass( "is-index-page" );
        }
    },


    changePageOut ( data ) {
        core.dom.html.addClass( "is-tranny" );
        this.setState( "future", data );
        navi.setActive( this.state.future.level1, this.state.future.level2, this.state.future.level3 );
        navi.close();

        setTimeout(() => {
            this.topper();

        }, this.duration );
    },


    changeContent ( data ) {
        boxen.controllers.destroy();
        this.setDoc( data );
        this.unsetClass();
        this.setClass();
        this.setState( "now", data );
        core.dom.main[ 0 ].innerHTML = this.doc.html;
        boxen.controllers.exec();
        core.emitter.fire( "app--tracker", this.doc );
    },


    changePageIn ( /*data*/ ) {
        setTimeout(() => {
            this.execSquarespace();
            core.dom.html.removeClass( "is-tranny" );

        }, this.duration );
    },


    route ( path ) {
        this.controller.getRouter().trigger( path );
    },


    push ( path, cb ) {
        this.controller.routeSilently( path, (cb || core.util.noop) );
    },


    topper () {
        window.scrollTo( 0, 0 );
    },


    // Initialize system-blocks after ProperJS PageController cycles.
    execSquarespace () {
        // Depending on your needs, you may have to turn some of these on:

        // window.Squarespace.initializeAcuityBlocks( window.Y );
        // window.Squarespace.initializeAspectRatioBlocks( window.Y );
        // window.Squarespace.initializeChartBlock( window.Y );
        // window.Squarespace.initializeCollectionPages( window.Y );
        // window.Squarespace.initializeDisqusCommentLinks( window.Y );
        // window.Squarespace.initializeDonationButton( window.Y );
        // window.Squarespace.initializeGlobalLightbox( window.Y );
        // window.Squarespace.initializeLayoutBlocks( window.Y );
        // window.Squarespace.initializeOpenTableBlock( window.Y );
        // window.Squarespace.initializeOpenTableV2Block( window.Y );
        // window.Squarespace.initializePageContent( window.Y );
        // window.Squarespace.initializeSocialLinks( window.Y );
        // window.Squarespace.initializeSoundcloudBlock( window.Y );
        // window.Squarespace.initializeSvgs( window.Y );
        // window.Squarespace.initializeZolaBlocks( window.Y );


        // Boxen core handles this stuff so you don't need to activate these:

        // window.Squarespace.initializeCommerce( window.Y );
        // window.Squarespace.initializeFormBlocks( window.Y );
        // window.Squarespace.initializeImageBlockDynamicElements( window.Y );
        // window.Squarespace.initializeNewsletterBlock( window.Y );
        // window.Squarespace.initializeSummaryV2Block( window.Y );
        // window.Squarespace.initializeVideo( window.Y );
        // window.Squarespace.initializeVideoBlock( window.Y );
        // window.Squarespace.initializeButtonBlock( window.Y );
        // window.Squarespace.initializeCartPage( window.Y );
        // window.Squarespace.initializeSearchBlock( window.Y );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default router;
