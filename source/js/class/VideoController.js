import $ from "properjs-hobo";
// import * as core from "../core";
import VideoFS from "./VideoFS";
import embedVideoView from "../views/embed-video";



/**
 *
 * @public
 * @global
 * @class Video
 * @classdesc Handle video logics.
 *
 */
class Video {
    constructor ( element ) {
        this.element = element;
        this.data = this.element.data();
        this.embed = $( embedVideoView( this.data ) );
        this.element.append( this.embed );
        this.videoFS = new VideoFS( this.element, this.embed, this.data );
    }


    destroy () {}
}



/**
 *
 * @public
 * @class VideoController
 * @param {Hobo} elements The video modules
 * @classdesc Handles videos
 *
 */
class VideoController {
    constructor ( elements ) {
        this.elements = elements;
        this.instances = [];

        this.init();
    }


    init () {
        this.elements.forEach(( element, i ) => {
            this.instances.push( new Video( this.elements.eq( i ) ) );
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
export default VideoController;
