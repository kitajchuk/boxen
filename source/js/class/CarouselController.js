import * as core from "../core";
import VideoFS from "./VideoFS";
// import $ from "properjs-hobo";



/**
 *
 * @public
 * @global
 * @class Carousel
 * @classdesc Handle carousels logics.
 *
 */
class Carousel {
    constructor ( element ) {
        this.element = element;
        this.items = this.element.find( ".js-carousel-item" );
        this.images = this.element.find( ".js-carousel-image" );
        this.videos = this.element.find( ".js-carousel-video" );
        this.active = this.items.eq( 0 );
        this.auto = {
            enabled: false,
            duration: 5000,
            timeout: null
        };
        this.data = {
            index: 0,
            length: this.items.length,
            timeout: null,
            duration: core.util.getElementDuration( this.active[ 0 ] )
        };

        this.load();
    }


    load () {
        this.videos.forEach(( el, i ) => {
            const elem = this.videos.eq( i );
            const data = elem.data();
            const uid = data.url.split( "/" ).pop();

            if ( data.provider === "vimeo" ) {
                const url = `https://player.vimeo.com/video/${uid}?wmode=opaque&autoplay=1&loop=1`;
                const embed = elem.find( ".js-embed" );
                const embedAspect = embed.find( ".js-embed-aspect" );

                embedAspect[ 0 ].style.paddingBottom = `${data.height / data.width * 100}%`;
                embedAspect[ 0 ].innerHTML = `<iframe class="embed__element" src="${url}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`;

                elem.data( "videoFS", new VideoFS( elem, embed, data ) );
            }
        });

        core.util.loadImages( this.images, core.util.noop )
            // .on( "load", ( img ) => {
            //     core.log( "[Carousel]::Loaded image", img );
            // })
            .on( "done", () => {
                this.active.addClass( "is-active" );

                this.bind();

                if ( this.auto.enabled ) {
                    this.update();
                }
            });
    }


    bind () {
        this.element.on( "click", () => {
            if ( this.auto.enabled ) {
                this.auto.enabled = false;

                core.log( "[Carousel]::Disable auto transition" );
            }

            this.advance();
        });
    }


    clear () {
        try {
            clearTimeout( this.auto.timeout );

            this.items.removeClass( "is-entering is-exiting is-active" );

        } catch ( error ) {
            core.log( "warn", error );
        }
    }


    clearAuto () {
        try {
            clearTimeout( this.auto.timeout );

        } catch ( error ) {
            core.log( "warn", error );
        }
    }


    update () {
        this.auto.timeout = setTimeout( this.advance.bind( this ), this.auto.duration );
    }


    transition ( $next, $curr ) {
        this.active = $next;

        $curr.removeClass( "is-active" ).addClass( "is-exiting" );
        $next.addClass( "is-entering" );

        this.data.timeout = setTimeout( () => {
            $curr.removeClass( "is-exiting" );
            $next.removeClass( "is-entering" ).addClass( "is-active" );

            if ( this.auto.enabled ) {
                this.update();
            }

        }, this.data.duration );
    }


    advance () {
        this.clear();

        if ( this.data.index === (this.data.length - 1) ) {
            this.data.index = 0;

        } else {
            this.data.index++;
        }

        this.transition(
            this.items.eq( this.data.index ),
            this.active
        );
    }


    rewind () {
        this.clear();

        if ( this.data.index === 0 ) {
            this.data.index = (this.data.length - 1);

        } else {
            this.data.index--;
        }

        this.transition(
            this.items.eq( this.data.index ),
            this.active
        );
    }


    destroy () {
        this.clear();
        this.clearAuto();
    }
}



/**
 *
 * @public
 * @global
 * @class CarouselController
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
        this.elements.forEach(( element, i ) => {
            this.instances.push( new Carousel( this.elements.eq( i ) ) );
        });
    }


    /**
     *
     * @instance
     * @description Teardown
     * @memberof CarouselController
     * @method destroy
     *
     */
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
