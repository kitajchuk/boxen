import Vimeo from "./Vimeo";
import Youtube from "./Youtube";



/**
 *
 * @public
 * @global
 * @class Video
 * @classdesc Handle video logics.
 *
 * blockJson
 *      url
 *      resolvedBy
 *      imageJson
 *      height
 *      width
 *
 */
class Video {
    constructor ( element, data ) {
        if ( data.blockJson.resolvedBy === "vimeo" ) {
            this.instance = new Vimeo( element, data );

        } else if ( data.blockJson.resolvedBy === "youtube" ) {
            this.instance = new Youtube( element, data );
        }
    }


    destroy () {
        this.instance.destroy();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Video;
