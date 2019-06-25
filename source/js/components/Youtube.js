import loadJS from "fg-loadjs";
import paramalama from "paramalama";
import * as core from "../core";
import youtubeView from "../views/youtube";
import Controller from "properjs-controller";



let _isYoutubeLoading = false;



/**
 *
 * @public
 * @global
 * @class Youtube
 * @classdesc Handle Youtube with JSAPI
 *
 */
class Youtube {
    constructor ( element, data ) {
        this.element = element;
        this.content = this.element.find( ".sqs-block-content" );
        this.data = data;
        this.isPlaying = false;
        this.params = paramalama( this.data.blockJson.url );
        this.id = this.params.v;
        this.buffer = new Controller();

        this.load();
        this.bind();

        console.log( this );
    }


    load () {
        this.image = this.element.find( "img" );
        this.data.imageJson = this.image.data();
        this.content[ 0 ].innerHTML = youtubeView( this.data.blockJson, this.data.imageJson );
        this.iframe = this.element.find( ".js-embed-iframe" );
        this.youtubeLoad();
        core.util.loadImages( this.element.find( core.config.lazyImageSelector ), core.util.noop );
    }


    bind () {
        this.element.on( "click", ".js-embed-playbtn", () => {
            if ( !this.isPlaying ) {
                this.play();
            }
        });
    }


    play () {
        this.buffer.go(() => {
            if ( this.youtubePlayer && this.youtubePlayer.playVideo ) {
                this.buffer.stop();
                this.youtubePlayer.playVideo();
            }
        });
    }


    pause () {
        this.youtubePlayer.pauseVideo();
    }


    bufferOnReady () {
        this.buffer.go(() => {
            if ( window.YT && !_isYoutubeLoading ) {
                this.buffer.stop();
                this.youtubeOnReady();
            }
        });
    }


    youtubeOnReady () {
        const playerVars = {
            disablekb: 1,
            controls: 1,
            iv_load_policy: 3,
            loop: 0,
            modestbranding: 1,
            playsinline: 0,
            rel: 0,
            showinfo: 0,
            wmode: "opaque",
            autoplay: 0
        };

        if ( this.data.minimal ) {
            playerVars.playsinline = 1;
            playerVars.controls = 0;
        }

        this.youtubePlayer = new window.YT.Player( this.iframe[ 0 ], {
            height: (this.data.blockJson.height || 9),
            width: (this.data.blockJson.width || 16),
            videoId: this.id,
            playerVars,
            events: {
                onReady: ( /*e*/ ) => {},
                onStateChange: ( e ) => {
                    /*
                        BUFFERING:3
                        CUED:5
                        ENDED:0
                        PAUSED:2
                        PLAYING:1
                        UNSTARTED:-1
                    */
                    if ( e.data === window.YT.PlayerState.PLAYING ) {
                        this.isPlaying = true;
                        this.element.addClass( "is-embed-playing" );

                    } else if ( e.data === window.YT.PlayerState.PAUSED ) {
                        this.isPlaying = false;

                    } else if ( e.data === window.YT.PlayerState.ENDED ) {
                        this.isPlaying = false;
                        this.element.removeClass( "is-embed-playing" );
                    }
                }
            }
        });
    }


    youtubeLoad () {
        if ( !window.YT && !_isYoutubeLoading ) {
            _isYoutubeLoading = true;
            window.onYouTubeIframeAPIReady = () => {
                _isYoutubeLoading = false;
                delete window.onYouTubeIframeAPIReady;

                this.youtubeOnReady();
            };

            loadJS( "https://www.youtube.com/iframe_api" );

        } else if ( _isYoutubeLoading ) {
            this.bufferOnReady();

        } else {
            this.youtubeOnReady();
        }
    }


    destroy () {
        this.buffer.stop();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Youtube;
