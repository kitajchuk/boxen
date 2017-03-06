import log from "./log";
import emitter from "./emitter";
import resizer from "./resizer";


/**
 *
 * @public
 * @namespace resizes
 * @memberof core
 * @description Handles app-wide emission of various resize detection events.
 *
 */
const resizes = {
    /**
     *
     * @public
     * @method init
     * @memberof core.resizes
     * @description Method binds event listeners for resize controller.
     *
     */
    init () {
        resizer.on( "resize", () => {
            emitter.fire( "app--resize" );
        });

        log( "resizes initialized" );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default resizes;
