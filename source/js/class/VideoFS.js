// import * as core from "../core";
import ResizeController from "properjs-resizecontroller";


/**
 *
 * @public
 * @global
 * @class VideoFS
 * @param {Element} video The dom element to work with.
 * @param {string} data The data for the video file
 * @classdesc Handle fullbleed cover video.
 *
 */
class VideoFS {
    constructor ( container, video, data ) {
        this.video = video;
        this.data = data;
        this.container = this.video[ 0 ].parentNode;
        this.resizer = new ResizeController();
        this.videoRatio = this.data.width / this.data.height;

        this.bind();
        this.onresize();
    }


    bind () {
        this.resizer.on( "resize", this.onresize.bind( this ) );
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

        this.video[ 0 ].style.width = `${videoWidth}px`;
        this.video[ 0 ].width = videoWidth;
    }


    destroy () {
        this.resizer.off( "resize" );
        this.resizer.destroy();
        this.resizer = null;
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default VideoFS;
