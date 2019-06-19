import * as core from "../core";
import $ from "properjs-hobo";
import Store from "../core/Store";



// Singleton
let _instance = null;



/**
 *
 * @public
 * @class Metrics
 * @classdesc Squarespace Metrics ( Analytics ). Google GA if applicable.
 *
 */
class Metrics {
    constructor () {
        if ( !_instance ) {
            core.emitter.on( "app--tracker", this.pushTrack.bind( this ) );

            core.log( "Metrics initialized" );

            _instance = this;
        }

        return _instance;
    }


    /**
     *
     * @public
     * @method pushTrack
     * @param {object} doc The doc object created by router {$doc, $page, pageData, pageHtml}
     * @memberof Metrics
     * @description Parse static context from responseText and track it.
     *
     */
    pushTrack ( doc ) {
        const mainTitle = (doc.data.itemTitle || doc.data.collectionTitle);
        const websiteId = doc.data.websiteId;
        const mainData = doc.data.itemId ? { itemId: doc.data.itemId } : { collectionId: doc.data.collectionId };

        // Squarespace Metrics
        this.recordHit( websiteId, mainData, mainTitle ).then(( res ) => {
            core.log( "RecordHit", res );

        }).catch(( error ) => {
            core.log( "warn", error );
        });

        // Google Analytics
        if ( window.ga ) {
            window.ga( "send", "pageview", window.location.href );
        }

        this.setDocumentTitle( mainTitle );
    }


    /**
     *
     * @public
     * @method setDocumentTitle
     * @param {string} title The new title for the document
     * @memberof Metrics
     * @description Update the documents title.
     *
     */
    setDocumentTitle ( title ) {
        document.title = title;
    }


    /**
     *
     * @public
     * @method recordHit
     * @param {string} websiteId The site ID
     * @param {object} mainData IDs for either collection or item
     * @param {string} websiteTitle Page title for tracking
     * @memberof Metrics
     * @description Record sqs metrics for async page requests.
     *              Returned Promise resolves with a data {object}
     * @returns {Promise}
     *
     */
    recordHit ( websiteId, mainData, websiteTitle ) {
        const datas = {
            url: window.location.pathname,
            queryString: window.location.search,
            userAgent: window.navigator.userAgent,
            referrer: "",
            localStorageSupported: Store.isStorageSupported,
            viewportInnerHeight: window.innerHeight,
            viewportInnerWidth: window.innerWidth,
            screenHeight: window.screen.height,
            screenWidth: window.screen.width,
            title: websiteTitle,
            websiteId: websiteId,
            templateId: websiteId,
            website_locale: "en-US",
            clientDate: Date.now()
        };

        if ( mainData.itemId ) {
            datas.itemId = mainData.itemId;

        } else {
            datas.collectionId = mainData.collectionId;
        }

        return $.ajax({
            url: `/api/census/RecordHit?crumb=${Store.crumb}`,
            method: "POST",
            data: {
                event: 1,
                data: JSON.stringify( datas ),
                ss_cvr: Store.ss_cvr
            },
            dataType: "json",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Metrics;
