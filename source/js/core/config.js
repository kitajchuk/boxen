/**
 *
 * @public
 * @namespace config
 * @memberof core
 * @description Stores app-wide config values.
 *
 */
const config = {
    /**
     *
     * @public
     * @member homepage
     * @memberof core.config
     * @description The default homepage slug.
     *
     */
    homepage: "home",


    /**
     *
     * @public
     * @member defaultDuration
     * @memberof core.config
     * @description The default duration for javascript Tweens.
     *
     */
    defaultDuration: 500,


    /**
     *
     * @public
     * @member lazyImageSelector
     * @memberof core.config
     * @description The string selector used for images deemed lazy-loadable.
     *
     */
    lazyImageSelector: ".js-lazy-image",
    mobileImageSelector: ".js-lazy-image[data-mobile]",
    mobileMediaHack: 640,
    lazyAnimSelector: ".js-lazy-anim",


    /**
     *
     * @public
     * @member lazyImageAttr
     * @memberof core.config
     * @description The string attribute for lazy image source URLs.
     *
     */
    lazyImageAttr: "data-img-src",


    /**
     *
     * @public
     * @member imageLoaderAttr
     * @memberof core.config
     * @description The string attribute ImageLoader gives loaded images.
     *
     */
    imageLoaderAttr: "data-imageloader"
};



/******************************************************************************
 * Export
*******************************************************************************/
export default config;
