import * as core from "../core";
// import $ from "properjs-hobo";
import Controller from "properjs-controller";
import socialsView from "../views/socials";

/**
 *
 * @public
 * @global
 * @class Socials
 * @param {Hobo} element The ProperJS Hobo instance
 * @classdesc Use social SVGs that Squarespace doesn't have defaults for
 *
 */
class Socials {
    constructor ( elements ) {
        this.elements = elements;
        this.blit = new Controller();
        this.tick = 0;
        this.test = {
            npm: /npmjs\.com/,
            tabi: /tabinohana\.com/
        };

        this.init();
    }


    init () {
        this.blit.go( this.handle.bind( this ) );
    }


    handle () {
        if ( this.tick === this.elements.length ) {
            this.blit.stop();
            this.blit = null;
            core.log( "[Socials done socializing]" );

        } else {
            this.elements.forEach(( el, i ) => {
                const element = this.elements.eq( i );
                const list = element.find( ".sqs-svg-icon--list" );

                if ( list.length ) {
                    this.tick++;

                    const unLinked = list.find( ".sqs-svg-icon--wrapper.url" );

                    if ( unLinked.length ) {
                        unLinked.forEach(( link, ii ) => {
                            if ( this.test.npm.test( link.href ) || this.test.tabi.test( link.href ) ) {
                                link.innerHTML = socialsView( this, unLinked.eq( ii ) );
                            }
                        });
                    }
                }
            });
        }
    }


    destroy () {
        if ( this.blit ) {
            this.blit.stop();
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Socials;
