import paramalama from "paramalama";



export default ( blockJson, imageJson ) => {
    const params = paramalama( blockJson.url );
    const id = params.v;
    const aspect = (blockJson.height || 9) / (blockJson.width || 16) * 100;
    const svgIcon = require( `../../../blocks/svg-play.block` );

    return `
        <div class="embed js-embed">
            <div class="embed__aspect" style="padding-bottom:${aspect}%;">
                <div id="${id}" class="embed__element js-embed-iframe"></div>
                ${blockJson.customThumb ? `
                    <div class="embed__poster embed__overlay js-embed-poster js-lazy-image -cover -text--center" data-img-src="${imageJson.src}?format=original">
                        <div class="embed__playbtn js-embed-playbtn">
                            ${svgIcon}
                        </div>
                    </div>
                ` : ``}
            </div>
            ${blockJson.description && (blockJson.layout !== "caption-hidden") ? `
                <div class="_cap">
                    <div class="m">${blockJson.description.html}</div>
                </div>
            ` : ``}
        </div>
    `;
};
