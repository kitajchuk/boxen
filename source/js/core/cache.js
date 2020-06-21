import Store from "./Store";


/**
 *
 * @public
 * @namespace cache
 * @memberof core
 * @see {@link Store}
 * @description Return Singleton instances of the cache Store.
 *
 */
export default new Store({
    // If TRUE the Store will use LocalStorage...
    enableStorage: false
});