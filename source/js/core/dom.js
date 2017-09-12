import $ from "properjs-hobo";
import config from "./config";


/**
 *
 * @public
 * @namespace dom
 * @memberof core
 * @description Holds high-level cached Nodes.
 *
 */
const dom = {
    /**
     *
     * @public
     * @member doc
     * @memberof core.dom
     * @description The cached document.
     *
     */
    doc: $( document ),


    /**
     *
     * @public
     * @member html
     * @memberof core.dom
     * @description The cached documentElement node.
     *
     */
    html: $( document.documentElement ),


    /**
     *
     * @public
     * @member body
     * @memberof core.dom
     * @description The cached body node.
     *
     */
    body: $( document.body ),


    /**
     *
     * @public
     * @member intro
     * @memberof core.dom
     * @description The cached intro node.
     *
     */
    intro: $( config.introSelector ),


    /**
     *
     * @public
     * @member main
     * @memberof core.dom
     * @description The cached main node.
     *
     */
    main: $( config.mainSelector ),


    /**
     *
     * @public
     * @member navi
     * @memberof core.dom
     * @description The cached <nav> nodes.
     *
     */
    navi: $( config.naviSelector )
};



/******************************************************************************
 * Export
*******************************************************************************/
export default dom;
