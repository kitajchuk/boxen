import * as core from "../core";
import vimeoView from "../views/vimeo";



// Local public instances hash ( resets )
let _instances = {};
const _onMessageInstance = ( message, instance ) => {
    // const title = instance.data.blockJson.html.match( /title\=\"(.*?)\"/ );
    const isSelf = (message.player_id && message.player_id === instance.id);

    if ( message.event === "ready" && isSelf ) {
        instance.postEmbed( "addEventListener", "play" );
        instance.postEmbed( "addEventListener", "pause" );
        instance.postEmbed( "addEventListener", "finish" );

    } else if ( message.event === "play" && isSelf ) {
        instance.isPlaying = true;
        instance.element.addClass( "is-embed-playing" );

    } else if ( message.event === "pause" && isSelf ) {
        instance.isPlaying = false;

    } else if ( message.event === "finish" && isSelf ) {
        instance.isPlaying = false;
        instance.element.removeClass( "is-embed-playing" );
    }
};

// Local public window.onmessage binding ( once )
window.addEventListener( "message", ( e ) => {
    const message = JSON.parse( e.data );
    const instance = _instances[ message.player_id ];

    if ( instance ) {
        _onMessageInstance( message, instance );
    }

}, false );



/**
 *
 * @public
 * @global
 * @class Video
 * @classdesc Handle vimeo.
 *
 */
class Vimeo {
    constructor ( element, data ) {
        this.element = element;
        this.content = this.element.find( ".sqs-block-content" );
        this.data = data;
        this.isPlaying = false;

        this.bind();
        this.load();
        this.push();
    }


    push () {
        if ( !_instances[ this.id ] ) {
            _instances[ this.id ] = this;
        }
    }


    load () {
        this.image = this.element.find( "img" );
        this.data.imageJson = this.image.data();
        this.content[ 0 ].innerHTML = vimeoView( this.data.blockJson, this.data.imageJson );
        this.iframe = this.element.find( ".js-embed-iframe" );
        this.id = this.iframe[ 0 ].id;
        this.iframe[ 0 ].src = this.iframe.data().src;
        core.util.loadImages( this.element.find( core.config.lazyImageSelector ), core.util.noop );
    }


    bind () {
        this.element.on( "click", ".js-embed-playbtn", () => {
            if ( !this.isPlaying ) {
                this.play();
            }
        });

        this.element.on( "mouseenter", ".js-embed-playbtn", () => {
            this.element.addClass( "is-play-button" );

        }).on( "mouseleave", ".js-embed-playbtn", () => {
            this.element.removeClass( "is-play-button" );
        });
    }


    postEmbed ( method, value ) {
        const data = {
            method
        };

        if ( value ) {
            data.value = value;
        }

        const message = JSON.stringify( data );

        this.iframe[ 0 ].contentWindow.postMessage( message, "*" );
    }


    play () {
        this.postEmbed( "play", "true" );
        this.isPlaying = true;
        this.element.addClass( "is-embed-playing" );
    }


    destroy () {
        _instances = {};
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Vimeo;
