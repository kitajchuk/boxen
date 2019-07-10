import router from "../router";
import * as core from "../core";
import $ from "properjs-hobo";
import cartView from "../views/cart";
import shopView from "../views/shop";
import productView from "../views/product";
import Controllers from "../Controllers";
import Store from "../core/Store";



/**
 *
 * @public
 * @global
 * @class Commerce
 * @param {Element} element The element to work with
 * @classdesc Handle sqs Commerce.
 *
 */
class Commerce {
    constructor ( element ) {
        this.element = element;
        this.script = this.element.find( "script" ).detach();
        this.parsed = this.script.length ? JSON.parse( this.script[ 0 ].textContent ) : {};
        this.shop = this.element.is( ".js-shop" ) ? this.element : [];
        this.product = this.element.is( ".js-product" ) ? this.element : [];
        this.cart = this.element.is( "#sqs-cart-root" ) ? this.element : [];
        this.view = this.shop.length ? shopView : productView;
        this.data = this.parsed;
        this.cartData = {};

        this.init();
        this.exec();
        this.bind();
    }


    bind () {
        this.element.on( "click", ".js-cart-add", () => {
            const payload = {
                itemId: this.data.item.id,
                quantity: 1,
                additionalFields: null
            };

            // digitalGoods will NOT have a sku NOR a variant object
            if ( this.data.item.structuredContent.variants[ 0 ] ) {
                payload.sku = this.data.item.structuredContent.variants[ 0 ].sku;
            }

            this.addCart( payload, () => {
                if ( window.Y.Squarespace.Commerce.isExpressCheckout() ) {
                    window.Y.Squarespace.Commerce.goToCheckoutPage();

                } else {
                    this.goToCartPage();
                }
            });
        });
    }


    bindCart () {
        this.cart.on( "click", ".js-cart-qty-min, .js-cart-qty-add", ( e ) => {
            const target = $( e.target );
            const entry = target.closest( ".js-cart-entry" );
            const value = target.is( ".js-cart-qty-min" ) ? target.next( ".js-cart-qty-val" ) : target.prev( ".js-cart-qty-val" );
            const price = entry.find( ".js-cart-price" );
            const total = this.cart.find( ".js-cart-subtotal" );
            const entryData = entry.data();
            const item = this.cartData.shopJSON.items.find(( itm ) => {
                return (itm.id === entryData.itemId);
            });
            const qtyMath = target.is( ".js-cart-qty-min" ) ? -1 : 1;
            let qty = parseInt( value[ 0 ].innerText, 10 );

            qty += qtyMath;

            value[ 0 ].innerText = qty;
            price[ 0 ].innerText = window.Y.Squarespace.Commerce.moneyString( item.structuredContent.variants[ 0 ].price * qty );

            this.qtyCart( qty, entryData.entryId ).then(( response ) => {
                total[ 0 ].innerText = window.Y.Squarespace.Commerce.moneyString( response.grandTotal.value );

                if ( qty === 0 ) {
                    entry.remove();
                }
            });
        });

        this.cart.on( "click", ".js-cart-checkout", () => {
            window.Y.Squarespace.Commerce.goToCheckoutPage();
        });
    }


    exec () {
        this.controllers = new Controllers({
            el: this.element
        });
        this.controllers.exec();
    }


    init () {
        if ( this.cart.length ) {
            window.Squarespace.initializeCartPage( window.Y );
            this.fetchShop().then(( shopResponse ) => {
                this.cartData.shopJSON = shopResponse;

                this.fetchCart().then(( cartResponse ) => {
                    this.cartData.cartJSON = cartResponse;
                    this.cart[ 0 ].innerHTML = cartView( shopResponse, cartResponse );
                    core.util.loadImages( this.cart.find( core.config.lazyImageSelector ), core.util.noop );
                    this.bindCart();
                });
            });

        } else {
            router.freeParseImages( this.element, this.view( this ) );
            window.Squarespace.initializeCommerce( window.Y );
        }
    }


    goToCartPage () {
        window.location.href = `${window.location.protocol}//${window.location.host}/cart/`;
    }


    fetchShop () {
        return new Promise(( resolve, reject ) => {
            $.ajax({
                url: `/${this.parsed.continueShoppingLinkUrl}/`,
                method: "GET",
                dataType: "json",
                data: {
                    format: "json"
                }
            }).then(( response ) => {
                resolve( response );

            }).catch(( error ) => {
                reject( error );
            });
        });
    }


    fetchCart () {
        return $.ajax({
            url: `/api/commerce/shopping-cart/?crumb=${Store.crumb}`,
            method: "GET",
            dataType: "json"
        });
    }


    addCart ( payload, callback ) {
        $.ajax({
            url: `/api/commerce/shopping-cart/entries/?crumb=${Store.crumb}`,
            payload: payload,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            dataType: "json"
        })
        .then(( response ) => {
            if ( response.crumbFail ) {
                Store.crumb = response.crumb;
                core.log( "warn", "Crumb fail. Trying again." );
                this.addCart( payload, callback );

            } else if ( callback ) {
                callback();
            }
        })
        .catch(( response ) => {
            try {
                response = JSON.parse( response );

            } catch ( parseError ) {
                core.log( "warn", parseError );
            }

            if ( (typeof response === "object") && response.message ) {
                this.alert = new window.Y.Squarespace.Widgets.Alert({
                    "strings.title": "Deem Journal",
                    "strings.message": response.message
                });
            }
        });
    }


    qtyCart ( qty, id ) {
        return $.ajax({
            url: `/api/commerce/cart/items/${id}?crumb=${Store.crumb}`,
            payload: {
                quantity: qty
            },
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            dataType: "json"
        });
    }


    destroy () {
        this.controllers.destroy();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Commerce;
