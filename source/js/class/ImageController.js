import * as util from "../core/util";
import log from "../core/log";
import Controller from "properjs-controller";


/**
 *
 * @public
 * @class ImageController
 * @param {Hobo} $images The image collection to load
 * @classdesc Handles breaking out the preload vs lazyload batches
 * @memberof core
 *
 */
class ImageController extends Controller {
    constructor ( $images ) {
        super();

        this.$preload = util.getElementsInView( $images );
        this.$lazyload = $images.not( this.$preload );
        this.loaders = {};

        if ( this.$preload.length ) {
            this.handleLoading( this.$preload, "preload", util.noop );

        } else {
            setTimeout(() => {
                this.fire( "preloaded" );

            }, 0 );
        }

        if ( this.$lazyload.length ) {
            this.handleLoading( this.$lazyload, "lazyload", util.isElementLoadable );
        }
    }


    /**
     *
     * @public
     * @method handleLoading
     * @param {Hobo} $images The batch to load
     * @param {string} event The event to fire
     * @param {function} handler The executor method to determine image loadability
     * @memberof core.ImageController
     * @description ImageLoader instance for loading a batch.
     *
     */
    handleLoading ( $images, event, handler ) {
        log( `ImageController ${event} queue:`, $images.length );

        let curr = 0;

        this.loaders[ event ] = util.loadImages( $images, handler );
        this.loaders[ event ].on( "load", ( elem ) => {
            curr++;

            this.fire( event, {
                done: curr,
                total: $images.length,
                element: elem
            });
        });
        this.loaders[ event ].on( "done", () => {
            log( `ImageController ${event}ed:`, $images.length );

            this.fire( `${event}ed` );
        });
    }


    /**
     *
     * @public
     * @method destroy
     * @memberof core.ImageController
     * @description Stop and kill ImageLoader instances.
     *
     */
    destroy () {
        let loader = null;

        for ( loader in this.loaders ) {
            if ( this.loaders.hasOwnProperty( loader ) ) {
                this.loaders[ loader ].stop();
                this.loaders[ loader ] = null;

                delete this.loaders[ loader ];
            }
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default ImageController;
