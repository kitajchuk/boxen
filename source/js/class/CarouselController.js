import CarouselHero from "./CarouselHero";
import CarouselInstagram from "./CarouselInstagram";
import CarouselThumbs from "./CarouselThumbs";



/**
 *
 * @public
 * @global
 * @class CarouselController
 * @param {Hobo} elements The carousel modules
 * @classdesc Handle carousels of various kinds and sorts.
 *
 */
class CarouselController {
    constructor ( elements ) {
        this.elements = elements;
        this.instances = [];

        this.init();
    }


    init () {
        this.elements.forEach(( el, i ) => {
            const elem = this.elements.eq( i );
            const data = elem.data();

            if ( data.type === "hero" ) {
                this.instances.push( new CarouselHero( elem, data ) );

            } else if ( data.type === "instagram" ) {
                this.instances.push( new CarouselInstagram( elem, data ) );

            } else if ( data.type === "thumbs" ) {
                this.instances.push( new CarouselThumbs( elem, data ) );
            }
        });
    }


    destroy () {
        this.instances.forEach(( instance ) => {
            instance.destroy();
        });
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default CarouselController;
