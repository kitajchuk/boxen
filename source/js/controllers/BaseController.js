/**
 *
 * @public
 * @class BaseController
 *
 */
class BaseController {
    constructor ( elements, component ) {
        this.elements = elements;
        this.component = component;
        this.instances = [];

        this.init();
    }


    init () {
        this.elements.forEach(( el, i ) => {
            const elem = this.elements.eq( i );
            const data = elem.data();

            this.instances.push( new this.component( elem, data ) );
        });
    }


    destroy () {
        this.instances.forEach(( instance ) => {
            instance.destroy();
            instance = null;
        });
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default BaseController;
