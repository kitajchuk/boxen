export default ( instance ) => {
    const starred = instance.data.items.find(( item ) => item.starred );
    const items = instance.data.items.filter(( item ) => !item.starred );
    const collection = instance.data.collection;
    const tagFilter = instance.data.tagFilter;
    const sysDataVars = "100w,300w,500w,750w,1000w,1500w,2500w";

    // Highlight a tag
    const hi = ( tag ) => {
        return (tagFilter && tagFilter === tag ? "hi" : "");
    };

    return `
        <div class="sqs-block-spacer"><div class="sqs-block-content"></div></div>
        ${tagFilter ? `
            <div class="shop__filters filters -wrap">
                <p>Tag filter: <span class="tag pink">${tagFilter}</span></p>
            </div>
        ` : ``}
        ${starred ? `
            <div class="shop__starred starred">
                <a class="starred__link" href="${starred.fullUrl}">
                    <img class="image js-lazy-image" data-img-src="${starred.assetUrl}" data-variants="${starred.systemDataVariants}" data-original-size="${starred.originalSize}" />
                </a>
                <div class="starred__info">
                    <div class="starred__title" data-content-field="title">${starred.title}</div>
                    <div class="starred__meta">
                        ${starred.tags.map(( tag ) => {
                            return `<span class="tag ${hi( tag )}">${hi( tag ) ? tag : `<a href="${collection.fullUrl}?tag=${tag}">${tag}</a>`}</span>`;

                        }).join( " " )}
                    </div>
                </div>
            </div>
        ` : ``}
        <div class="shop__grid mason ${starred ? `-expt` : ``}">
            ${items.map(( item ) => {
                return `
                    <div class="mason__item">
                        <a class="mason__link" href="${item.itemUrl || item.fullUrl}">
                            <img class="mason__image image js-lazy-image ${item.structuredContent ? item.structuredContent.variants[ 0 ].qtyInStock === 0 ? "soldout" : "" : ""}" data-img-src="${item.imageUrl || item.assetUrl}" data-variants="${item.systemDataVariants || sysDataVars}" data-original-size="${item.originalSize ? item.originalSize : ``}" />
                            <div class="mason__info">
                                <div class="mason__title">${item.title}${item.structuredContent ? item.structuredContent.variants[ 0 ].qtyInStock === 0 ? ` &mdash; <span class="red">Sold Out</span>` : "" : ""}</div>
                                <div class="mason__meta">
                                    ${item.tags.map(( tag ) => {
                                        return `<span class="tag ${hi( tag )}">${hi( tag ) ? tag : `<a href="${collection.fullUrl}?tag=${tag}">${tag}</a>`}</span>`;

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
