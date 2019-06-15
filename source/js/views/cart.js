export default ( shopJSON, cartJSON ) => {
    const getAttributes = ( item ) => {
        const attrs = [];

        for ( const i in item.structuredContent.variants[ 0 ].attributes ) {
            if ( item.structuredContent.variants[ 0 ].attributes.hasOwnProperty( i ) ) {
                attrs.push( `<div class="m">${item.structuredContent.variants[ 0 ].attributes[ i ]}</div>` );
            }
        }

        return attrs.join( "" );
    };

    return `
        <div class="cart">
            ${cartJSON.message ? `
                <p>${cartJSON.message}</p>
            ` : `
                <div class="cart__tabular">
                    <div>ITEM</div>
                    <div>QTY</div>
                    <div>PRICE</div>
                </div>
                ${cartJSON.entries.map(( entry ) => {
                    const item = shopJSON.items.find(( itm ) => {
                        return (itm.id === entry.itemId);
                    });

                    return `
                        <div class="cart__entry js-cart-entry" data-item-id="${item.id}" data-entry-id="${entry.id}">
                            <div class="cart__item">
                                <div class="cart__thumb">
                                    <div class="media js-media">
                                        <div class="media__wrap">
                                            <img class="media__node image js-lazy-image" data-img-src="${item.assetUrl}" data-variants="${item.systemDataVariants}" data-original-size="${item.originalSize}" />
                                        </div>
                                    </div>
                                </div>
                                <div class="cart__desc">
                                    <div class="cart__title">${item.isSubscribable ? item.title : (item.excerpt || item.title)}</div>
                                    <div class="cart__attrs">
                                        ${getAttributes( item )}
                                    </div>
                                </div>
                            </div>
                            <div class="cart__qty js-cart-qty">
                                <div class="p min js-cart-qty-min">-</div>
                                <div class="p js-cart-qty-val">${entry.quantity}</div>
                                <div class="p add js-cart-qty-add">+</div>
                            </div>
                            <div class="cart__price">
                                <p class="js-cart-price">${window.Y.Squarespace.Commerce.moneyString( entry.subTotal )}</p>
                            </div>
                        </div>
                    `;

                }).join( "" )}
                <div class="cart__subtotal">
                    <div class="_button js-cart-checkout">Checkout</div>
                    <p>Subtotal <span class="js-cart-subtotal">${window.Y.Squarespace.Commerce.moneyString( cartJSON.grandTotalCents )}</span></p>
                </div>
            `}
        </div>
    `;
};
