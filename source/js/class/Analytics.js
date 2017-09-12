import * as core from "../core";
import $ from "properjs-hobo";
import Store from "../core/Store";


// Singleton
let _instance = null;


/**
 *
 * @public
 * @class Analytics
 * @classdesc Handles Squarespace Metrics and Google Analytics.
 *            @see {@link https://developers.google.com/analytics/devguides/collection/analyticsjs/}
 * @memberof core
 *
 */
class Analytics {
    constructor () {
        if ( !_instance ) {
            core.emitter.on( "app--analytics-pageview", this.pushTrack.bind( this ) );

            core.log( "Analytics initialized" );

            this.apiEndpoint = "/api/census/RecordHit";

            _instance = this;
        }

        return _instance;
    }


    /**
     *
     * @public
     * @method pushTrack
     * @param {object} doc The doc object created by router {$doc, $page, pageData, pageHtml}
     * @memberof class.Analytics
     * @description Parse static context from responseText and track it.
     *
     */
    pushTrack ( doc ) {
        const mainTitle = (doc.data.itemTitle || doc.data.collectionTitle);
        const websiteId = doc.data.websiteId;
        const mainData = doc.data.itemId ? { itemId: doc.data.itemId } : { collectionId: doc.data.collectionId };

        // Squarespace Metrics
        if ( core.env.isProd() ) {
            this.recordHit( websiteId, mainData, mainTitle ).then(( res ) => {
                core.log( "Analytics", res );

            }).catch(( error ) => {
                core.log( "warn", error );
            });
        }

        this.setDocumentTitle( mainTitle );
    }


    /**
     *
     * @public
     * @method setDocumentTitle
     * @param {string} title The new title for the document
     * @memberof class.Analytics
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
     * @memberof class.Analytics
     * @description Record sqs metrics for async page requests.
     *              Returned Promise resolves with a data {object}
     * @returns {Promise}
     *
     */
    recordHit ( websiteId, mainData, websiteTitle ) {
        const datas = {
            url: window.location.href,
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
            templateId: websiteId
        };

        if ( mainData.itemId ) {
            datas.itemId = mainData.itemId;

        } else {
            datas.collectionId = mainData.collectionId;
        }

        return $.ajax({
            url: `${this.apiEndpoint}?crumb=${Store.crumb}`,
            method: "POST",
            data: {
                event: "View",
                data: JSON.stringify( datas )
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
export default Analytics;
