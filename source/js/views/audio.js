export default ( /*instance*/ ) => {
    const svgPlayIcon = require( `../../../blocks/svg-play.block` );
    const svgPauseIcon = require( `../../../blocks/svg-pause.block` );

    return `
        <div class="_audio__station">
            <div class="_audio__controls _audio__controls--onboard js-audio-pp">
                <div class="_audio__pp">
                    ${svgPlayIcon}
                    ${svgPauseIcon}
                </div>
                <div class="_audio__state js-audio-state p">
                    <span>Listen</span>
                    <span>Playing</span>
                </div>
            </div>
            <div class="_audio__ellapsed p">
                <span class="js-audio-status">0:00</span>
            </div>
        </div>
        <audio class="_audio__node js-audio-node"></audio>
    `;
};
