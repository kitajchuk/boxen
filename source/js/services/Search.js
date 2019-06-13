import * as core from "../core";
import $ from "properjs-hobo";
import viewSearch from "../views/search";
import viewSearchTags from "../views/search-tags";
import viewSearchResults from "../views/search-results";
import Store from "../core/Store";
import debounce from "properjs-debounce";
import ResizeController from "properjs-resizecontroller";
// import AnimateController from "../controllers/AnimateController";
import ImageController from "../controllers/ImageController";



class Search {
    constructor ( element, data ) {
        this.element = element;
        this.parent = this.element.parent();
        this.elemData = data;
        this.script = this.element.find( "script" ).detach();
        this.blockJson = JSON.parse( this.script[ 0 ].textContent );
        this.element.data( "instance", this );
        this.placeholders = {
            default: "Start typing to search",
            mobile: "Search"
        };
        this.data = {};
        this.ajax = null;
        this.waiting = 300;
        this.isFetch = false;
        this.isTag = false;

        this.load().then(() => {
            this.bind();

            if ( this.elemData.results ) {
                this.bindResults();
            }
        });
    }


    load () {
        return new Promise(( resolve ) => {
            this.element[ 0 ].innerHTML = viewSearch( this );
            this.search = this.element.find( ".js-search-field" );
            this.button = this.element.find( ".js-search-btn" );
            this.doResize();
            this.fetchTags();
            resolve();
        });
    }


    bind () {
        this.button.on( "click", () => {
            this.clear();

            if ( this.isTag ) {
                this.clearTagged();
            }
        });

        this.search.on( "keyup", () => {
            if ( this.search[ 0 ].value ) {
                this.button.addClass( "is-active" );
                this.parent.addClass( "is-keytext" );

            } else {
                this.button.removeClass( "is-active" );
                this.parent.removeClass( "is-keytext" );
            }
        });

        this.resizer = new ResizeController();
        this.resizer.on( "resize", () => {
            this.doResize();
        });
    }


    bindResults () {
        this.results = this.parent.find( this.elemData.results );
        this.loader = this.results.find( ".js-search-loader" );
        this.display = this.results.find( ".js-search-display" );

        this.button.on( "click", () => {
            this.emptyResults();
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


    bindTags () {
        this.tagsEl.on( "click", ".js-tag", ( e ) => {
            const tag = $( e.target );
            const data = tag.data();

            this.clear();
            this.search[ 0 ].placeholder = data.tag;
            this.search[ 0 ].blur();
            this.search[ 0 ].disabled = true;
            this.search.addClass( "is-tagged" );
            this.fetchTag( data.tag );
            this.parent.addClass( "is-tagged" );
            this.button.addClass( "is-active" );
            this.isTag = true;
        });
    }


    doResize () {
        if ( window.innerWidth <= core.config.mobileMediaHack ) {
            this.search[ 0 ].placeholder = this.placeholders.mobile;

        } else {
            this.search[ 0 ].placeholder = this.placeholders.default;
        }
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
            // this.animController.start();
        });
        // this.imageController.$preload.closest( core.config.lazyAnimSelector ).removeClass( "js-lazy-anim" );
        // this.animController = new AnimateController( this.display );
    }


    reset () {
        this.search[ 0 ].blur();
        this.search[ 0 ].value = "";
        this.clearTagged();
        this.emptyResults();
        this.button.removeClass( "is-active" );
        this.loader.removeClass( "is-active" );
        this.tags.removeClass( "is-active" );
    }


    clear () {
        this.search[ 0 ].value = "";
        this.search[ 0 ].focus();
        this.button.removeClass( "is-active" );
        this.parent.removeClass( "is-keytext" );
        this.search.removeClass( "is-tagged" );
        this.parent.removeClass( "is-tagged" );
    }


    clearTagged () {
        this.isTag = false;
        this.search[ 0 ].disabled = false;
        this.search.removeClass( "is-tagged" );
        this.parent.removeClass( "is-tagged" );
        this.doResize();
    }


    fetchTags () {
        return new Promise(( resolve, reject ) => {
            $.ajax({
                url: "/stories/",
                method: "GET",
                dataType: "json",
                data: {
                    format: "json"
                }
            }).then(( response ) => {
                resolve( response );
                this.filters = this.parent.find( ".js-search-filters" );
                this.filters[ 0 ].innerHTML = viewSearchTags( response );
                this.tagsEl = this.filters.find( ".js-tags" );
                this.tags = this.filters.find( ".js-tag" );
                this.bindTags();

            }).catch(( error ) => {
                reject( error );
            });
        });
    }


    fetchTag ( tag ) {
        this.isFetch = true;
        this.loader.addClass( "is-active" );
        this.emptyResults();

        return new Promise(( resolve, reject ) => {
            $.ajax({
                url: "/stories/",
                method: "GET",
                dataType: "json",
                data: {
                    format: "json",
                    tag
                }

            }).then(( response ) => {
                resolve();
                this.handle( response );

            }).catch(( response ) => {
                reject();
                this.handle( response );
            });
        });
    }


    fetchQuery ( query ) {
        return $.ajax({
            url: "/api/search/GeneralSearch",
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            dataType: "json",
            data: {
                crumb: Store.crumb,
                q: query,
                p: 0,
                size: 12,
                f_collectionId:	this.blockJson.collectionId
            }
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
        if ( this.resizer ) {
            this.resizer.destroy();
        }

        // if ( this.animController ) {
        //     this.animController.destroy();
        // }

        if ( this.imageController ) {
            this.imageController.destroy();
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Search;
