import * as core from "../core";
import CarouselCore from "./CarouselCore";
import ScrollController from "properjs-scrollcontroller";
import ResizeController from "properjs-resizecontroller";
import Hammer from "hammerjs";



class CarouselHero extends CarouselCore {
    constructor ( element ) {
        super( element );

        this.copy = this.element.find( ".js-carousel-copy" );
        this.indexes = this.element.find( ".js-carousel-index-item" );
        this.activeIndex = this.element.find( ".js-carousel-index-active" );
        this.imageTimeout = null;
        this.imageDuration = 6000;

        this.bind();
        this.prep();
        this.check( this.active );
        this.index();
        this.display( this.active );
    }


    bind () {
        this.on( "transition", ( next ) => {
            this.clearEmbed();
            this.clearImage();
            this.check( next );
            this.index();
            this.display( next );
        });

        // Not for mobile devices and SHIT...
        if ( !core.detect.isDevice() ) {
            this.resizer = new ResizeController();
            this.resizer.on( "resize", () => {
                this.index();
            });

            this.scroller = new ScrollController();
            this.scroller.on( "scroll", () => {
                const shouldPause = !core.util.isElementVisible( this.element[ 0 ] ) && this.activeEmbed;
                const shouldPlay = core.util.isElementVisible( this.element[ 0 ] ) && this.activeEmbed;

                if ( shouldPause ) {
                    this.postEmbed( "pause", 1 );

                } else if ( shouldPlay ) {
                    this.postEmbed( "play", 1 );
                }
            });

            this._onMessage = this.onMessage.bind( this );
            window.addEventListener( "message", this._onMessage, false );

        // For mobile devices and SHIT...
        } else {
            this.hammer = new Hammer( this.element[ 0 ] );
            this.hammer.on( "swipe", ( e ) => {
                if ( e.direction === Hammer.DIRECTION_LEFT ) {
                    this._advance();

                } else if ( e.direction === Hammer.DIRECTION_RIGHT ) {
                    this._rewind();
                }
            });
        }
    }


    prep () {
        const btns = this.copy.find( "a" );

        btns.forEach(( el, i ) => {
            const elem = btns.eq( i );
            const text = elem[ 0 ].innerText.replace( /^\s+|\s$|\n|\t/g, "" );

            elem.addClass( "button button--size-large button--naira button--naira-up" );

            elem[ 0 ].innerHTML = `<div class="button__hover">${text}</div><div class="button__main">${text}</div>`;
        });
    }


    index () {
        const index = this.indexes.eq( this.data.index );

        core.util.translate3d(
            this.activeIndex[ 0 ],
            `${index[ 0 ].offsetLeft}px`,
            "-50%",
            0
        );
    }


    display ( active ) {
        const display = active.data( "display" );

        if ( display ) {
            this.element.removeClass( "-dark -light" ).addClass( display );
        }
    }


    check ( active ) {
        this.activeVideo = active.find( ".js-carousel-video" );

        if ( this.activeVideo.length ) {
            this.activeEmbed = this.activeVideo.find( ".js-embed-iframe" );
            this.activeVideoData = this.activeVideo.data();

            if ( this.activeEmbed.length && this.activeVideoData.provider === "vimeo" ) {
                this.handleVimeo( active );
            }

        } else {
            this.handleImage( active );
        }
    }


    postEmbed ( method, value ) {
        const data = {
            value,
            method
        };
        const message = JSON.stringify( data );

        this.activeEmbed[ 0 ].contentWindow.postMessage( message, "*" );
    }


    handleImage () {
        this.imageTimeout = setTimeout(() => {
            this.clearEmbed();
            this._advance();
            core.log( "[Carousel] static image timeout" );

        }, this.imageDuration );
    }


    handleVimeo ( /*active*/ ) {
        this.activeEmbed[ 0 ].src = this.activeEmbed.data().src;
    }


    onMessage ( e ) {
        if ( e.data ) {
            const data = JSON.parse( e.data );

            if ( data.event === "ready" ) {
                this.postEmbed( "addEventListener", "play" );
                this.postEmbed( "addEventListener", "finish" );
                core.log( "[Carousel] iframe embed is ready" );

            } else if ( data.event === "play" ) {
                core.log( "[Carousel] iframe embed playback start" );

            } else if ( data.event === "finish" ) {
                this.clearEmbed();
                this._advance();
                core.log( "[Carousel] iframe embed playback end" );
            }
        }
    }


    clearEmbed () {
        if ( this.activeEmbed ) {
            this.activeEmbed[ 0 ].src = "";
        }
    }


    clearImage () {
        if ( this.imageTimeout ) {
            clearTimeout( this.imageTimeout );
            this.imageTimeout = null;
        }
    }


    destroy () {
        if ( this._onMessage ) {
            window.removeEventListener( "message", this._onMessage, false );
        }

        if ( this.resizer ) {
            this.resizer.off( "resize" );
        }

        if ( this.scroller ) {
            this.scroller.off( "scroll" );
        }

        if ( this.hammer ) {
            this.hammer.destroy();
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default CarouselHero;
