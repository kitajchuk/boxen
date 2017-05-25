import * as core from "../core";
import ResizeController from "properjs-resizecontroller";


/**
 *
 * @public
 * @global
 * @class VideoFS
 * @param {Element} video The dom element to work with.
 * @param {string} source The url of the video file
 * @classdesc Handle fullbleed cover video.
 *
 */
class VideoFS {
    constructor ( video, source ) {
        this.video = video;
        this.source = source;
        this.container = this.video[ 0 ].parentNode;
        this.resizer = new ResizeController();

        this.bind();
    }


    bind () {
        this.video.on( "loadedmetadata", () => {
            this.videoRatio = this.video[ 0 ].videoWidth / this.video[ 0 ].videoHeight;
            this.video.attr( "data-videoloaded", "true" );
            this.onresize();
        });
        this.video[ 0 ].src = this.source;
        this.video[ 0 ].muted = true;
        this.video[ 0 ].load();

        this._onresize = this.onresize.bind( this );

        this.resizer.on( "resize", this._onresize );
    }


    stop () {
        this.video[ 0 ].pause();
    }


    play () {
        this.video[ 0 ].play();
    }


    onresize () {
        const nodeRect = this.container.getBoundingClientRect();
        const windowRatio = nodeRect.width / nodeRect.height;
        const adjustRatio = this.videoRatio / windowRatio;
        let videoWidth = null;

        if ( windowRatio < this.videoRatio ) {
            videoWidth = nodeRect.width * adjustRatio;

        } else {
            videoWidth = nodeRect.width;
        }

        this.video[ 0 ].style.width = core.util.px( videoWidth );
        this.video[ 0 ].width = videoWidth;
    }


    /**
     *
     * @instance
     * @description Stop the animation frame
     * @memberof VideoFS
     * @method destroy
     *
     */
    destroy () {
        if ( this._onresize ) {
            this.resizer.off( "resize", this._onresize );
            this.resizer.destroy();
            this.resizer = null;
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default VideoFS;
