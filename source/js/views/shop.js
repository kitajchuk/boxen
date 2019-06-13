export default ( instance ) => {
    const items = instance.data.items.filter(( item ) => {
        return !item.isSubscribable;
    });
    const subItem = instance.data.items.find(( item ) => {
        return item.isSubscribable;
    });
    const isGridView = (items.length >= 3);
    const getGridView = () => {
        return `<div class="grid js-shop-grid">${items.map(( item ) => {
            return `
                <div class="grid__item">
                    <a class="grid__link" href="${item.fullUrl}">
                        <img class="grid__image image js-lazy-image" data-img-src="${item.assetUrl}" data-variants="${item.systemDataVariants}" data-original-size="${item.originalSize}" />
                        <div class="grid__info">
                            <div class="grid__title">
                                <div>${item.title}</div>
                                <div>$${item.structuredContent.variants[ 0 ].priceMoney.value}</div>
                            </div>
                        </div>
                    </a>
                </div>
            `;

        }).join( "" )}</div>`;
    };
    const getStackView = () => {
        return `${items.map(( item ) => {
            const isIssue = (item.tags[ 0 ] === "Issue");

            return `
                <div class="stack">
                    <div class="stack__wrap">
                        <img class="stack__image image js-lazy-image" data-img-src="${item.assetUrl}" data-variants="${item.systemDataVariants}" data-original-size="${item.originalSize}" />
                        <div class="stack__info">
                            <h3>${item.excerpt || item.title}</h3>
                            <a class="p" href="${item.fullUrl}">${isIssue ? `View Issue` : `Learn More`}</a>
                        </div>
                    </div>
                </div>
            `;

        }).join( "" )}`;
    };

    return `
        ${isGridView ? getGridView() : getStackView()}
        ${subItem ? `
            <div class="stack stack--sub">
                <div class="stack__wrap">
                    <img class="stack__image image js-lazy-image" data-img-src="${subItem.assetUrl}" data-variants="${subItem.systemDataVariants}" data-original-size="${subItem.originalSize}" />
                    <div class="stack__info">
                        <h3>${subItem.title}</h3>
                        <a class="p" href="${subItem.fullUrl}">${subItem.excerpt}</a>
                    </div>
                </div>
            </div>
        ` : ``}
    `;
};
