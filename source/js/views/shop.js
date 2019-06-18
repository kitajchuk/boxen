export default ( instance ) => {
    console.log( instance );

    const starred = instance.data.items.find(( item ) => item.starred );
    const items = instance.data.items.filter(( item ) => !item.starred );

    return `
        <div class="shop__mast">
            <div class="sqs-block-spacer"><div class="sqs-block-content"></div></div>
            <div class="-wrap">
                <h1><em>${instance.data.collection.title}</em></h1>
                ${instance.data.collection.description}
            </div>
            <div class="sqs-block-horizontalrule"><hr /></div>
        </div>
        ${starred ? `
            <a class="shop__starred starred" href="${starred.fullUrl}">
                <img class="image js-lazy-image" data-img-src="${starred.assetUrl}" data-variants="${starred.systemDataVariants}" data-original-size="${starred.originalSize}" />
                <div class="starred__info">
                    <div class="starred__title" data-content-field="title">${starred.title}</div>
                    <div class="starred__meta">
                        ${starred.tags.map(( tag ) => {
                            return `<span class="teal">${tag}</span>`;

                        }).join( ", " )}
                    </div>
                </div>
            </a>
        ` : ``}
        <div class="sqs-block-spacer"><div class="sqs-block-content"></div></div>
        <div class="shop__grid mason">
            ${items.map(( item ) => {
                return `
                    <div class="mason__item">
                        <a class="mason__link" href="${item.itemUrl || item.fullUrl}">
                            <img class="mason__image image js-lazy-image" data-img-src="${item.imageUrl || item.assetUrl}" data-variants="100w,300w,500w,750w,1000w,1500w,2500w" />
                            <div class="mason__info">
                                <div class="mason__title">${item.title}</div>
                                <div class="mason__meta">
                                    ${item.tags.map(( tag ) => {
                                        return `<span class="teal">${tag}</span>`;

                                    }).join( ", " )}
                                </div>
                            </div>
                        </a>
                    </div>
                `;

            }).join( "" )}
        </div>
    `;
};
