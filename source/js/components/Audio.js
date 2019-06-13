import * as core from "../core";
// import $ from "properjs-hobo";
import audioView from "../views/audio";
import ScrollController from "properjs-scrollcontroller";


/**
 *
 * @public
 * @global
 * @class Audio
 * @param {Element} element The element to work with
 * @classdesc Handle annotated text nodes.
 *
 */
class Audio {
    constructor ( element ) {
        this.element = element;
        this.script = this.element.find( "script" ).detach();
        this.parsed = JSON.parse( this.script[ 0 ].textContent );
        this.dropout = core.dom.body.find( ".js-summary-v2" );
        this.data = { blockJson: this.parsed };
        this.isPlaying = false;

        this.init();
        this.bind();
    }


    init () {
        this.element[ 0 ].innerHTML = audioView( this );
        this.global = this.element.find( ".js-audio-global" );
        this.audioStatus = this.element.find( ".js-audio-status" );
        this.audioState = this.element.find( ".js-audio-state" );
        this.audioPlayback = this.element.find( ".js-audio-pp" );
        this.audioSkipBackward = this.element.find( ".js-audio-skipbackward" );
        this.audioSkipForward = this.element.find( ".js-audio-skipforward" );
        this.audioNode = this.element.find( ".js-audio-node" );
        this.audioNode[ 0 ].src = this.data.blockJson.audioAssetUrl;
        this.audioStatus.forEach(( el, i ) => {
            this.audioStatus[ i ].innerHTML = core.util.formatTime( this.data.blockJson.audioAssetDuration );
        });
    }


    bind () {
        this.scroller = new ScrollController();
        this.scroller.on( "scroll", () => {
            const bounds = this.element[ 0 ].getBoundingClientRect();

            if ( bounds.bottom < 0 ) {
                this.element.addClass( "is-audio-offscreen" );

            } else {
                this.element.removeClass( "is-audio-offscreen" );
            }

            if ( this.dropout.length ) {
                const collider = this.dropout[ 0 ].getBoundingClientRect();
                const globalBounds = this.global[ 0 ].getBoundingClientRect();

                if ( collider.y < globalBounds.y ) {
                    this.element.addClass( "is-audio-collider" );

                } else {
                    this.element.removeClass( "is-audio-collider" );
                }
            }
        });

        this.audioPlayback.on( "click", () => {
            this.togglePP();
        });

        this.audioNode.on( "ended", () => {
            this.pause();
            this.audioNode[ 0 ].currentTime = 0;
            this.audioStatus.forEach(( el, i ) => {
                this.audioStatus[ i ].innerHTML = core.util.formatTime( this.data.blockJson.audioAssetDuration );
            });
        });

        this.audioNode.on( "timeupdate", () => {
            this.audioStatus.forEach(( el, i ) => {
                this.audioStatus[ i ].innerHTML = core.util.formatTime( this.audioNode[ 0 ].currentTime * 1000 );
            });
        });

        this.audioSkipForward.on( "click", () => {
            this.audioNode[ 0 ].pause();
            this.audioNode[ 0 ].currentTime = (this.audioNode[ 0 ].currentTime + 15);
            this.audioNode[ 0 ].play();
        });

        this.audioSkipBackward.on( "click", () => {
            this.audioNode[ 0 ].pause();
            this.audioNode[ 0 ].currentTime = (this.audioNode[ 0 ].currentTime - 15) || 0;
            this.audioNode[ 0 ].play();
        });
    }


    play () {
        this.isPlaying = true;
        this.element.addClass( "is-audio-playing has-audio-played" );
        this.audioNode[ 0 ].play();
        this.audioState.forEach(( el, i ) => {
            this.audioState[ i ].style.width = `${el.getBoundingClientRect().width}px`;
        });
    }


    pause () {
        this.isPlaying = false;
        this.element.removeClass( "is-audio-playing" );
        this.audioNode[ 0 ].pause();
        this.audioState.forEach(( el, i ) => {
            this.audioState[ i ].style.width = `${el.getBoundingClientRect().width}px`;
        });
    }


    togglePP () {
        if ( this.isPlaying ) {
            this.pause();

        } else {
            this.play();
        }
    }


    destroy () {
        if ( this.scroller ) {
            this.scroller.destroy();
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Audio;
