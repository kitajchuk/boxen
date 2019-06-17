// import $ from "properjs-hobo";
// import * as core from "../core";



export default ( instance ) => {
    const getField = ( field ) => {
        let ret = ``;

        if ( field.name ) {
            ret = `<input type="${field.type}" class="inp inp--grey js-form-input" ${field.required ? `required` : ``} placeholder="Your name" name="${field.id}" value="Automoton" />`;
        }

        if ( field.email ) {
            ret = `
                <input type="email" class="inp inp--grey js-form-input" ${field.required ? `required` : ``} placeholder="Your email" name="${field.id}" />
                <button type="submit" class="btn btn--grey js-form-submit">${instance.blockJson.form.submitButtonText}</button>
            `;
        }

        return ret;
    };

    return `
        <div class="form__entry">
            <div class="form__fieldset form__fieldset--title">
                <p class="grey">${instance.blockJson.title}</p>
                <div class="m dark">${instance.blockJson.description.html}</div>
            </div>
            ${instance.blockJson.form.parsedFields.map(( field ) => {
                return `<div class="form__fieldset form__fieldset--inline">${getField( field )}</div>`;

            }).join( "" )}
        </div>
        <div class="form__message js-form-message"></div>
    `;
};
