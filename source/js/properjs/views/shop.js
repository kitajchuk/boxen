export default ( instance ) => {
    const starred = instance.data.items.find(( item ) => item.starred );
    const items = instance.data.items.filter(( item ) => !item.starred );
    const sysDataVars = "100w,300w,500w,750w,1000w,1500w,2500w";

    return `
        <div class="sqs-block-spacer"><div class="sqs-block-content"></div></div>
        ${starred ? `
            <a class="shop__starred starred" href="${starred.fullUrl}">
                <img class="image js-lazy-image" data-img-src="${starred.assetUrl}" data-variants="${starred.systemDataVariants}" data-original-size="${starred.originalSize}" />
                <div class="starred__info">
                    <div class="starred__title" data-content-field="title">${starred.title}</div>
                    <div class="starred__meta">
                        ${starred.tags.map(( tag ) => {
                            return `<span class="grey">${tag}</span>`;

                        }).join( " " )}
                    </div>
                </div>
            </a>
        ` : ``}
        <div class="shop__grid mason ${(items.length <= 2) ? `mason--diptych` : ``} ${starred ? `-expt` : ``}">
            ${items.map(( item ) => {
                return `
                    <div class="mason__item">
                        <a class="mason__link" href="${item.itemUrl || item.fullUrl}">
                            <img class="mason__image image js-lazy-image ${item.structuredContent ? item.structuredContent.variants[ 0 ].qtyInStock === 0 ? "soldout" : "" : ""}" data-img-src="${item.imageUrl || item.assetUrl}" data-variants="${item.systemDataVariants || sysDataVars}" data-original-size="${item.originalSize ? item.originalSize : ``}" />
                            <div class="mason__info">
                                <div class="mason__title">${item.title}${item.structuredContent ? item.structuredContent.variants[ 0 ].qtyInStock === 0 ? ` &mdash; <span class="red">Sold Out</span>` : "" : ""}</div>
                                <div class="mason__meta">
                                    ${item.tags.map(( tag ) => {
                                        return `<span class="grey">${tag}</span>`;

                                    }).join( " " )}
                                </div>
                            </div>
                        </a>
                    </div>
                `;

            }).join( "" )}
        </div>
    `;
};
