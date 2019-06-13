import $ from "properjs-hobo";



export default ( instance ) => {
    const blockJson = instance.blockJson;
    const placeHolder = $( blockJson.description.html );
    const emailField = blockJson.form.parsedFields.find(( field ) => {
        return (field.type === "email");
    });

    return `
        <div class="newsletter__label">
            <p>${blockJson.title}</p>
        </div>
        <div class="newsletter__form -exp">
            <div class="newsletter__entry">
                <input type="email" class="newsletter__input inp js-newsletter-field" name="${emailField.id}" placeholder="${placeHolder[ 0 ].innerText}" />
                <button class="newsletter__btn js-newsletter-btn btn">Submit</button>
            </div>
            <div class="newsletter__loading">
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
            <div class="newsletter__success">
                ${blockJson.form.parsedSubmissionMessage.html}
            </div>
        </div>
    `;
};
