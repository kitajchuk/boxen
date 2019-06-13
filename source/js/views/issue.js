import $ from "properjs-hobo";



export default ( instance ) => {
    const item = instance.blockJson.product;
    const image = item.items[ 1 ] || item.items[ 0 ];
    const htmlText = $( instance.productJson.item.body ).find( ".sqs-block-html" )[ 0 ].innerText;

    // console.log( instance );

    return `
        <div class="stack stack--sub">
            <div class="stack__wrap">
                <img class="stack__image image js-lazy-image" data-img-src="${image.assetUrl}" data-variants="${image.systemDataVariants}" data-original-size="${image.originalSize}" />
                <div class="stack__info">
                    <h3 class="issue__title">${item.excerpt || item.title}</h3>
                    <p class="issue__desc">${htmlText}</p>
                    <a class="issue__button _button _button--lit" href="${item.fullUrl}">${item.structuredContent.customAddButtonText}</a>
                </div>
            </div>
        </div>
    `;
};
