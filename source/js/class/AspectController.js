import * as core from "../core";


/**
 *
 * @public
 * @global
 * @class AspectController
 * @classdesc Handle setting aspect ratio with JS.
 *
 */
class AspectController {
    constructor ( elements ) {
        this.elements = elements;

        this.init();
    }

    init () {
        this.elements.forEach(( el, i ) => {
            const elem = this.elements.eq( i );
            const data = elem.data();
            const dims = core.util.getOriginalDims( data.original );

            el.style.paddingBottom = `${dims.height / dims.width * 100}%`;
        });
    }

    destroy () {}
}



/******************************************************************************
 * Export
*******************************************************************************/
export default AspectController;
