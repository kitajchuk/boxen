import * as core from "../core";
import Controller from "properjs-controller";
import Hammer from "hammerjs";


const getParsedTime = function ( time ) {
    time *= 1000;

    const minutes = parseInt( time / (1000 * 60), 10 );
    let seconds = parseInt( time / 1000, 10) % 60;

    if ( seconds < 10 ) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
};


const enterFsMode = function ( node ) {
    if ( node.requestFullscreen ) {
        node.requestFullscreen();

    } else if ( node.webkitRequestFullscreen ) {
        node.webkitRequestFullscreen();

    } else if ( node.mozRequestFullScreen ) {
        node.mozRequestFullScreen();

    } else if ( node.msRequestFullscreen ) {
        node.msRequestFullscreen();
    }
};


const exitFsMode = function () {
    if ( document.exitFullscreen ) {
        document.exitFullscreen();

    } else if ( document.webkitExitFullscreen ) {
        document.webkitExitFullscreen();

    } else if ( document.mozCancelFullScreen ) {
        document.mozCancelFullScreen();

    } else if ( document.msExitFullscreen ) {
        document.msExitFullscreen();
    }
};


const isFsMode = function () {
    return (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    );
};


class Video {
    constructor ( element ) {
        this.element = element;
        this.video = this.element.find( ".js-video-node" );
        this.videoData = this.video.data();

        if ( !this.videoData.autoplay ) {
            this.bind();
        }

        this.init();
    }


    init () {
        this.video.on( "loadedmetadata", () => {
            if ( !this.videoData.autoplay ) {
                this.time[ 0 ].innerHTML = getParsedTime( this.video[ 0 ].currentTime );
                this.duration[ 0 ].innerHTML = getParsedTime( this.video[ 0 ].duration );

            } else {
                this.auto();
            }
        });

        this.video[ 0 ].src = this.videoData.src;
        this.video[ 0 ].load();
    }


    bind () {
        this.time = this.element.find( ".js-video-time" );
        this.duration = this.element.find( ".js-video-duration" );
        this.fill = this.element.find( ".js-video-fill" );
        this.sound = this.element.find( ".js-video-sound" );
        this.fs = this.element.find( ".js-video-fs" );
        this.bar = this.element.find( ".js-video-bar" );

        this.bindVideo();
        this.bindScrub();
    }


    bindScrub () {
        this.bar.on( "click", ( e ) => {
            const bounds = this.bar[ 0 ].getBoundingClientRect();
            const width = e.clientX - bounds.left;
            const time = (width / bounds.width) * this.video[ 0 ].duration;

            this.isScrubbing = true;
            this.video[ 0 ].pause();
            this.video[ 0 ].currentTime = time;
            this.fill.addClass( "is-transition" );

            setTimeout(() => {
                this.fill[ 0 ].style.width = core.util.px( width );

            }, 0 );

            setTimeout(() => {
                this.isScrubbing = false;
                this.video[ 0 ].play();
                this.fill.removeClass( "is-transition" );

            }, core.util.getElementDuration( this.fill[ 0 ] ) );
        });

        this.hammer = new Hammer( this.bar[ 0 ], core.util.getDefaultHammerOptions() );
        this.onscrubpan = ( e ) => {
            const width = e.srcEvent.clientX - this.fill[ 0 ].getBoundingClientRect().left;
            const percent = width / this.bar[ 0 ].clientWidth;
            const time = percent * this.video[ 0 ].duration;

            this.video[ 0 ].pause();
            this.video[ 0 ].currentTime = time;
            this.fill[ 0 ].style.width = core.util.px( width );
            this.time[ 0 ].innerHTML = getParsedTime( this.video[ 0 ].currentTime );
        };
        this.hammer.on( "panstart", () => {
            this.isScrubbing = true;
        });
        this.hammer.on( "panend", () => {
            this.isScrubbing = false;
            this.video[ 0 ].play();
        });
        this.hammer.on( "panleft", this.onscrubpan );
        this.hammer.on( "panright", this.onscrubpan );
    }


    bindVideo () {
        this.video.on( "play", () => {
            this.element.addClass( "is-playing is-playback" );
        });

        this.video.on( "pause", () => {
            if ( !this.isScrubbing ) {
                this.element.removeClass( "is-playing" );
            }
        });

        this.video.on( "ended", () => {
            this.element.removeClass( "is-playing is-playback" );
        });

        this.video.on( "timeupdate", () => {
            this.time[ 0 ].innerHTML = getParsedTime( this.video[ 0 ].currentTime );
            this.fill[ 0 ].style.width = `${((this.video[ 0 ].currentTime / this.video[ 0 ].duration) * 100)}%`;
        });

        this.video.on( "click", () => {
            if ( this.video[ 0 ].paused ) {
                this.video[ 0 ].play();

            } else {
                this.video[ 0 ].pause();
            }
        });

        this.sound.on( "click", () => {
            if ( this.video[ 0 ].muted ) {
                this.video[ 0 ].muted = false;

            } else {
                this.video[ 0 ].muted = true;
            }
        });

        this.fs.on( "click", () => {
            if ( isFsMode() ) {
                exitFsMode();

            } else {
                enterFsMode( this.video[ 0 ] );
            }
        });
    }


    auto () {
        this.autoController = new Controller();
        this.autoController.go(() => {
            if ( core.util.isElementVisible( this.video[ 0 ] ) && this.video[ 0 ].paused ) {
                this.video[ 0 ].play();

                this.killAuto();
            }
        });
    }


    killAuto () {
        if ( this.autoController ) {
            this.autoController.stop();
            this.autoController = null;
        }
    }


    destroy () {
        this.killAuto();

        if ( !this.videoData.autoplay ) {
            this.fs.off();
            this.video.off();
            this.sound.off();
        }

        if ( this.hammer ) {
            this.hammer = null;
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Video;
