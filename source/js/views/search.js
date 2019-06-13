export default () => {
    return `
        <div class="search__form">
            <div class="search__entry">
                <input type="text" class="search__input inp js-search-field" name="q" placeholder="Start typing to search" />
                <button class="search__btn js-search-btn btn">Clear</button>
            </div>
        </div>
    `;
};
