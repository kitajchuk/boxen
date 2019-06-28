// import $ from "properjs-hobo";
const svgMap = {
    npm: require( `../../../blocks/svg-npm.block` ),
    tabi: require( `../../../blocks/svg-tabi.block` ),
    kickstarter: require( `../../../blocks/svg-kickstarter.block` )
};



export default ( instance, test, link ) => {
    link.addClass( `${test.name}-unauth` );

    return `<div>
        ${svgMap[ test.name ]}
    </div>`;
};
