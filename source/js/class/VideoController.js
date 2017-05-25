import $ from "properjs-hobo";
import Video from "./Video";


/**
 *
 * @public
 * @class VideoController
 * @param {Hobo} elements The video modules
 * @classdesc Handles videos
 * @memberof core
 *
 */
class VideoController {
    constructor ( elements ) {
        this.elements = elements;
        this.instances = [];

        this.elements.forEach(( node ) => {
            this.instances.push( new Video( $( node ) ) );
        });
    }


    /**
     *
     * @public
     * @method destroy
     * @memberof core.VideoController
     * @description Stop and kill video instances.
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
export default VideoController;
