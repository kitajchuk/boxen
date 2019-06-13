// import * as core from "../core";
import $ from "properjs-hobo";
import { TweenLite, Power3 } from "gsap/TweenMax";
import ResizeController from "properjs-resizecontroller";


/**
 *
 * @public
 * @global
 * @class Slider
 * @param {Element} element The element to work with
 * @classdesc Handle slider galleries.
 *
 */
class Slider {
    constructor ( element, data ) {
        this.element = element;
        this.belt = this.element.find( ".js-slider-belt" );
        this.items = this.element.find( ".js-slider-item" );
        this.length = this.items.length;
        this.data = data;
        this.time = 500;
        this.index = 0;

        this.init();
        this.bind();
    }


    bind () {
        this.element.on( "click", ".js-slider-item", ( e ) => {
            const target = $( e.target );

            this.evaluate( target );
        });

        this.resizer = new ResizeController();
        this.resizer.on( "resize", () => {
            this.evaluate( this.items.eq( this.index ) );
        });
    }


    evaluate ( target ) {
        const index = target.index();
        const targetBounds = target[ 0 ].getBoundingClientRect();
        const targetMargin = parseFloat( window.getComputedStyle( target[ 0 ] )[ "margin-left" ] );
        const isFirst = (index === 0);
        const isLast = (index === (this.length - 1));
        let position = 0;
        let offset = 0;

        this.items.forEach(( item, i ) => {
            if ( i <= index ) {
                const bounds = item.getBoundingClientRect();
                const margin = parseFloat( window.getComputedStyle( item )[ "margin-left" ] );

                offset += bounds.width + margin;
            }
        });

        if ( isFirst ) {
            // Position is zero

        } else if ( isLast ) {
            // First baseline right edge to left edge
            // position = ((-bounds.width - margin) * index) - (margin * (index - 1));
            position += -offset;

            // Next baseline to right edge
            position += window.innerWidth - targetMargin;

        } else {
            // First baseline to left edge
            position += -offset;

            // Next baseline left edge to center viewport axis
            position += (window.innerWidth / 2);

            // Finally pull the element left of central axis by half its width
            position += (targetBounds.width / 2);
        }

        this.index = index;
        this.move( position );
    }


    move ( position ) {
        this.tween = new TweenLite.to( this.belt[ 0 ], (this.time / 1000), {
            x: position,
            ease: Power3.easeOut
        });
    }


    init () {}


    destroy () {
        if ( this.resizer ) {
            this.resizer.destroy();
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Slider;
