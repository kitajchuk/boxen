import * as core from "../core";
import $ from "properjs-hobo";
import viewSearch from "../views/search";
import viewSearchResults from "../views/search-results";
import Store from "../core/Store";
import debounce from "properjs-debounce";
import ImageController from "../controllers/ImageController";



class Search {
    constructor ( element ) {
        this.element = element;
        this.script = this.element.find( "script" ).detach();
        this.blockJson = this.script.length ? JSON.parse( this.script[ 0 ].textContent ) : null;
        this.ajax = null;
        this.waiting = 300;
        this.isFetch = false;

        if ( this.element.is( ".sqs-search-page" ) ) {
            this.element.addClass( "search" );
        }

        this.load().then(() => {
            this.bind();
        });
    }


    load () {
        return new Promise(( resolve ) => {
            this.element[ 0 ].innerHTML = viewSearch( this );
            this.results = this.element.find( ".js-search-results" );
            this.loader = this.element.find( ".js-search-loader" );
            this.display = this.element.find( ".js-search-display" );
            this.search = this.element.find( ".js-search-input" );
            this.button = this.element.find( ".js-search-btn" );
            resolve();
        });
    }


    bind () {
        this.button.on( "click", () => {
            this.clear();
        });

        this.search.on( "keyup", () => {
            if ( this.search[ 0 ].value ) {
                this.button.addClass( "is-active" );
                this.element.addClass( "is-keytext" );

            } else {
                this.button.removeClass( "is-active" );
                this.element.removeClass( "is-keytext" );
            }
        });

        this.search.on( "keyup", debounce(() => {
            // Abort existing request to start anew
            if ( this.isFetch ) {
                this.ajax.abort();
                this.isFetch = false;
                this.fetch();

            // Make a clean request starting from scratch
            } else if ( !this.isFetch && this.search[ 0 ].value ) {
                this.fetch();
            }

        }, this.waiting ));
    }


    emptyResults () {
        this.display.find( ".js-search-grid" ).removeClass( "is-active" );
        this.display[ 0 ].innerHTML = "";
    }


    displayResults ( json ) {
        this.display[ 0 ].innerHTML = viewSearchResults( (json || { items: [] }) );
        this.imageController = new ImageController( this.display.find( core.config.lazyImageSelector ) );
        this.imageController.on( "preloaded", () => {
            this.display.find( ".js-search-grid" ).addClass( "is-active" );
        });
    }


    // reset () {
    //     this.search[ 0 ].blur();
    //     this.search[ 0 ].value = "";
    //     this.emptyResults();
    //     this.button.removeClass( "is-active" );
    //     this.loader.removeClass( "is-active" );
    // }


    clear () {
        this.search[ 0 ].value = "";
        this.search[ 0 ].focus();
        this.emptyResults();
        this.button.removeClass( "is-active" );
        this.element.removeClass( "is-keytext" );
    }


    fetchQuery ( query ) {
        const data = {
            crumb: Store.crumb,
            q: query,
            p: 0
        };

        if ( this.blockJson ) {
            data.f_collectionId = this.blockJson.collectionId;
        }

        return $.ajax({
            url: "/api/search/GeneralSearch",
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            dataType: "json",
            data
        });
    }


    handle ( response ) {
        this.isFetch = false;
        this.loader.removeClass( "is-active" );

        if ( response.serviceError ) {
            this.displayResults( null );

        } else {
            this.displayResults( response );
        }
    }


    fetch () {
        this.isFetch = true;
        this.loader.addClass( "is-active" );
        this.emptyResults();
        this.ajax = this.fetchQuery( this.search[ 0 ].value );
        this.ajax.then(( response ) => {
            this.handle( response );

        }).catch(( response ) => {
            this.handle( response );
        });
    }


    destroy () {
        if ( this.imageController ) {
            this.imageController.destroy();
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Search;
