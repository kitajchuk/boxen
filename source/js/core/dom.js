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
     * @member navi
     * @memberof core.dom
     * @description The cached <header> node.
     *
     */
    header: $( ".js-header" ),


    /**
     *
     * @public
     * @member views
     * @memberof core.dom
     * @description The cached <main> node.
     *
     */
    main: $( config.mainSelector ),


    /**
     *
     * @public
     * @member views
     * @memberof core.dom
     * @description The cached <navi> node.
     *
     */
    navi: $( ".js-navi" ),


    /**
     *
     * @public
     * @member views
     * @memberof core.dom
     * @description The cached <intro> node.
     *
     */
    intro: $( ".js-intro" ),


    /**
     *
     * @public
     * @member views
     * @memberof core.dom
     * @description The cached <footer> node.
     *
     */
    footer: $( ".js-footer" )
};



/******************************************************************************
 * Export
*******************************************************************************/
export default dom;
