import * as core from "../core";
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
        this.tests = [
            {
                name: "npm",
                regex: /npmjs\.com/
            },
            {
                name: "tabi",
                regex: /tabinohana\.com/
            },
            {
                name: "kickstarter",
                regex: /kickstarter\.com/
            }
        ];

        this.init();
    }


    init () {
        this.blit.go( this.handle.bind( this ) );
    }


    testLink ( link ) {
        let ret = null;

        this.tests.forEach(( test ) => {
            if ( test.regex.test( link.href ) ) {
                ret = test;
            }
        });

        return ret;
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
                            const tested = this.testLink( link );

                            if ( tested ) {
                                link.innerHTML = socialsView( this, tested, unLinked.eq( ii ) );
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
