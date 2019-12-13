// import $ from "properjs-hobo";
// import * as core from "../core";



export default ( instance ) => {
    const getField = ( field ) => {
        let ret = ``;

        // Normalize name as a single field and split later
        if ( field.name || field.text ) {
            ret = `<input type="${field.type}" class="inp js-form-input" ${field.required ? `required` : ``} placeholder="${field.placeholder || field.description}" name="${field.id}" />`;
        }

        if ( field.textarea ) {
            ret = `<textarea class="area js-form-input" ${field.required ? `required` : ``} placeholder="${field.placeholder || field.description}" name="${field.id}"></textarea>`;
        }

        if ( field.phone ) {
            ret = `<input type="tel" class="inp js-form-input" ${field.required ? `required` : ``} pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="${field.placeholder || field.description} ex: 555-555-5555" name="${field.id}" />`;
        }

        if ( field.email ) {
            ret = `<input type="email" class="inp js-form-input" ${field.required ? `required` : ``} placeholder="${field.placeholder || field.description}" name="${field.id}" />`;
        }

        if ( field.select ) {
            ret = `<div class="sel-wrap">
                <select class="sel js-form-input js-form-select" ${field.required ? `required` : ``} name="${field.id}">
                    <option value="">--${field.description}--</option>
                    ${field.options.map(( option ) => {
                        return `<option value="${option}">${option}</option>`;

                    }).join( "" )}
                </select>
            </div>`;
        }

        if ( field.radio || field.checkbox ) {
            ret = `
                <div class="m">${field.description}</div>
                <div class="form__checks js-form-checks">
                    ${field.options.map(( option ) => {
                        return `<label for="${field.id}__${option.replace( /\s/, "-" )}">
                            <input type="${field.type}" class="check js-form-input" ${field.required ? `required` : ``} name="${field.id}" id="${field.id}__${option.replace( /\s/, "-" )}" />
                            <span class="m">${option}</span>
                        </label>`;

                    }).join( "" )}
                </div>
            `;
        }

        return ret;
    };

    return `
        <div class="form__entry">
            ${instance.blockJson.formFields.map(( field ) => {
                return `<div class="form__fieldset">${getField( field )}</div>`;

            }).join( "" )}
            <div class="form__fieldset form__submit -text--${instance.blockJson.buttonAlignment}">
                <button type="submit" class="btn js-form-submit">${instance.blockJson.formSubmitButtonText}</button>
            </div>
        </div>
        <div class="form__message js-form-message"></div>
    `;
};
