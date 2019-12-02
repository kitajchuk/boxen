export default ( instance ) => {
    const item = instance.data.item;
    const variant = item.structuredContent.variants[ 0 ];
    const digital = item.digitalGoods;
    const percent = Math.round( ((variant.price - variant.salePrice) / variant.price) * 100 );
    const collection = instance.data.collection;
    const isSoldOut = (variant.qtyInStock === 0);
    const isOneLeft = (variant.qtyInStock === 1);

    return `
        <div class="stack">
            <div class="stack__item">
                <div class="sqs-block-spacer"><div class="sqs-block-content"></div></div>
                <div class="stack__link">
                    <div class="stack__mast">
                        <div class="stack__primo">
                            <h1 class="stack__title" data-content-field="title">${item.title}</h1>
                            <div class="stack__meta">
                                ${item.tags.map(( tag ) => {
                                    return `<span class="grey">${tag}</span>`;

                                }).join( " " )}
                            </div>
                        </div>
                        <div class="stack__bounce">
                            ${isSoldOut ? `` : `
                                <p class="green">
                                    <span class="${variant.onSale ? `red -strike` : ``}">$${digital ? item.structuredContent.priceMoney.value : variant.priceMoney.value}</span>
                                    ${variant.onSale ? `
                                        <span>$${variant.salePriceMoney.value} <span class="m grey">(You save ${percent}%)</span></span>

                                    ` : ``}
                                </p>
                            `}
                            ${digital ? `` : `
                                <div class="product__buy">
                                    <a class="btn ${isSoldOut ? "btn--red" : "js-cart-add"}" href="#"><span class="btn__a">${isSoldOut ? "Sold Out" : item.structuredContent.customAddButtonText}</span></a>
                                </div>
                            `}
                        </div>
                    </div>
                    ${digital ? `
                        <div class="product__info cms">
                            <div class="product__about">
                                ${item.body}
                            </div>
                            <div class="product__buy">
                                <a class="btn js-cart-add" href="#"><span class="btn__a">${item.structuredContent.customAddButtonText}</span></a>
                            </div>
                        </div>
                    ` : ``}
                    <img class="stack__image image js-lazy-image ${isSoldOut ? "soldout" : ""}" data-img-src="${item.assetUrl}" data-variants="${item.systemDataVariants}" data-original-size="${item.originalSize}" />
                </div>
            </div>
        </div>
        ${digital ? `` : `
            <div class="product__info cms">
                <div class="product__about">
                    ${item.body}
                    ${isSoldOut ? `<div class="product__limited m yellow">Someone already snagged this one!</div>` : isOneLeft ? `<div class="product__limited m yellow">There's only one of these in the world!</div>` : `<div class="product__limited m yellow">${collection.navigationTitle} are limited! I have <span class="green">${variant.qtyInStock}</span> remaining.</div>`}
                </div>
                <div class="product__buy">
                    <a class="btn ${isSoldOut ? "btn--red" : "js-cart-add"}" href="#"><span class="btn__a">${isSoldOut ? "Sold Out" : item.structuredContent.customAddButtonText}</span></a>
                </div>
            </div>
        `}
        ${digital ? `` : `
            <div class="product__photos -wrap">
                ${item.items.map(( image ) => {
                    return `
                        <div class="sqs-block-spacer"><div class="sqs-block-content"></div></div>
                        <img class="stack__image image js-lazy-image" data-img-src="${image.assetUrl}" data-variants="${image.systemDataVariants}" data-original-size="${image.originalSize}" />
                    `;

                }).join( "" )}
            </div>
        `}
    `;
};
