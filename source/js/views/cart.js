export default ( shopJSON, cartJSON ) => {
    const getAttributes = ( item ) => {
        const attrs = [];

        if ( item.structuredContent.variants[ 0 ] ) {
            for ( const i in item.structuredContent.variants[ 0 ].attributes ) {
                if ( item.structuredContent.variants[ 0 ].attributes.hasOwnProperty( i ) ) {
                    attrs.push( `<div class="m">${item.structuredContent.variants[ 0 ].attributes[ i ]}</div>` );
                }
            }

        } else if ( item.digitalGoods ) {
            attrs.push( `<div class="m">Digital Download</div>` );
        }

        return attrs.join( "" );
    };

    return `
        <div class="cart">
            <div class="sqs-block-spacer"><div class="sqs-block-content"></div></div>
            <h1 class="teal">Your cart</h1>
            <div class="sqs-block-spacer"><div class="sqs-block-content"></div></div>
            ${cartJSON.message ? `
                <p>${cartJSON.message}</p>
            ` : `
                <div class="cart__tabular">
                    <div class="teal">Items</div>
                    <div class="teal">Qty.</div>
                    <div class="teal">Price</div>
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
                                ${item.digitalGoods ? `` : `<div class="m min red js-cart-qty-min">-</div>`}
                                <div class="m js-cart-qty-val">${entry.quantity}</div>
                                ${item.digitalGoods ? `` : `<div class="m add green js-cart-qty-add">+</div>`}
                            </div>
                            <div class="cart__price">
                                <p class="m green js-cart-price">${window.Y.Squarespace.Commerce.moneyString( entry.subTotal )}</p>
                            </div>
                        </div>
                    `;

                }).join( "" )}
                <div class="cart__subtotal">
                    <div class="btn js-cart-checkout"><span class="btn__a">Checkout</span></div>
                    <p class="m">Subtotal <span class="js-cart-subtotal">${window.Y.Squarespace.Commerce.moneyString( cartJSON.grandTotalCents )}</span></p>
                </div>
            `}
            <div class="sqs-block-spacer"><div class="sqs-block-content"></div></div>
        </div>
    `;
};
