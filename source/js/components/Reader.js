// import * as core from "../core";



/**
 *
 * @public
 * @global
 * @class Reader
 * @param {Hobo} element The ProperJS Hobo instance
 * @classdesc Use social SVGs that Squarespace doesn't have defaults for
 *
 */
class Reader {
    constructor ( element ) {
        this.element = element;
        this.books = this.element.find( ".sqs-block-horizontalrule + .sqs-block-html p a" );

        this.init();
    }


    init () {
        this.books.forEach(( el, i ) => {
            const link = this.books.eq( i );

            link[ 0 ].target = "_blank";
            link[ 0 ].href = `https://google.com/search?q=${link[ 0 ].innerText}&tbm=bks`;
        });
    }


    destroy () {}
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Reader;
