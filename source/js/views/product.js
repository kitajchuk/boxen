export default ( instance ) => {
    const item = instance.data.item;
    const isOutOfStock = (item.structuredContent.variants[ 0 ].qtyInStock === 0);
    const getAttributes = () => {
        const attrs = [];

        for ( const i in item.structuredContent.variants[ 0 ].attributes ) {
            if ( item.structuredContent.variants[ 0 ].attributes.hasOwnProperty( i ) ) {
                attrs.push( `<p>${item.structuredContent.variants[ 0 ].attributes[ i ]}</p>` );
            }
        }

        return attrs.join( "" );
    };

    return `
        <div class="p1 ${isOutOfStock ? `is-out-of-stock` : ``}">
            <div class="text-col">
                <div class="p1__title">
                    <h3>${item.isSubscribable ? item.title : (item.excerpt || item.title)}</h3>
                </div>
                <div class="p1__button sqs-row">
                    <div class="_button js-button_" data-block-json="">${item.structuredContent.customAddButtonText}</div>
                    <div class="sqs-block-content">
                        <p class="p">$${item.structuredContent.variants[ 0 ].priceMoney.value}</p>
                    </div>
                </div>
                <div class="p1__shipping">
                    <p>Free standard <a href="#" target="_blank">domestic shipping</a></p>
                </div>
                <div class="p1__attributes">
                    ${getAttributes()}
                </div>
            </div>
            <div class="image-col">
                <div class="media js-media">
                    <div class="media__wrap">
                        <img class="media__node image js-lazy-image" data-img-src="${item.assetUrl}" data-variants="${item.systemDataVariants}" data-original-size="${item.originalSize}" />
                    </div>
                </div>
            </div>
        </div>
        <article data-item-id="${item.id}" class="story story--detail js-story">
            <div class="story__blocks">
                ${item.body}
            </div>
        </div>
    `;
};
