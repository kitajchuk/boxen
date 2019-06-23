export default ( blockJson, imageJson ) => {
    const url = blockJson.url.replace( /\?.*?$/, "" );
    const path = "https://player.vimeo.com/video/";
    const id = url.split( "/" ).pop();
    const qrs = `?&wmode=opaque&api=1&loop=0&autoplay=1&player_id=${id}`;
    const source = `${path}${id}${qrs}`;
    const width = (blockJson.width && blockJson.height) ? blockJson.width : 16;
    const height = (blockJson.height && blockJson.width) ? blockJson.height : 9;
    const aspect = height / width * 100;
    const original = `${width}x${height}`;
    const svgIcon = require( `../../../blocks/svg-play.block` );

    // console.log( blockJson );

    return `
        <div class="embed js-embed">
            <div class="embed__aspect" style="padding-bottom:${aspect}%;">
                <iframe id="${id}" class="embed__element js-embed-iframe js-media-node" data-src="${source}" data-original="${original}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
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
