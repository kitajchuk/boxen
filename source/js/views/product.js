export default ( instance ) => {
    const item = instance.data.item;
    const variant = item.structuredContent.variants[ 0 ];

    return `
        <div class="stack">
            <div class="stack__item">
                <div class="sqs-block-spacer"><div class="sqs-block-content"></div></div>
                <div class="stack__link">
                    <div class="stack__mast">
                        <div class="stack__primo">
                            <div class="stack__title" data-content-field="title">${item.title}</div>
                            <div class="stack__meta">
                                ${item.tags.map(( tag ) => {
                                    return `<span class="teal">${tag}</span>`;

                                }).join( ", " )}
                            </div>
                        </div>
                        <div class="stack__bounce">
                            <p class="green">$${variant.priceMoney.value}</p>
                        </div>
                    </div>
                    <img class="stack__image image js-lazy-image" data-img-src="${item.assetUrl}" data-variants="${item.systemDataVariants}" data-original-size="${item.originalSize}" />
                </div>
            </div>
        </div>
        <div class="product__info cms">
            <div class="product__about">
                ${item.body}
                <div class="product__limited m yellow">Prints are limited! I have <span class="green">${variant.qtyInStock}</span> remaining.</div>
            </div>
            <div class="product__buy">
                <a class="btn js-cart-add" href="#"><span class="btn__a">${item.structuredContent.customAddButtonText}</span></a>
            </div>
        </div>
        <div class="product__photos">
            ${item.items.map(( image ) => {
                return `
                    <div class="sqs-block-spacer"><div class="sqs-block-content"></div></div>
                    <img class="stack__image image js-lazy-image" data-img-src="${image.assetUrl}" data-variants="${image.systemDataVariants}" data-original-size="${image.originalSize}" />
                `;

            }).join( "" )}
        </div>
    `;
};
