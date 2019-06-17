export default () => {
    return `
        <div class="sqs-block-spacer"><div class="sqs-block-content"></div></div>
        <div class="search__form">
            <input type="text" class="search__input inp inp--grey js-search-input" name="q" placeholder="Type here to search" />
            <button class="search__btn js-search-btn btn btn--grey">Clear</button>
        </div>
        <div class="search__results js-search-results">
            <div class="search__loading js-search-loader">
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
            <div class="search__display js-search-display"></div>
        </div>
        <div class="sqs-block-spacer"><div class="sqs-block-content"></div></div>
    `;
};
