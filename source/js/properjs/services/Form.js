import $ from "properjs-hobo";
import formView from "../views/form";
import newsletterView from "../views/newsletter";
import * as core from "../core";
import router from "../router";



const views = {
    form: formView,
    newsletter: newsletterView
};



/**
 *
 * @public
 * @global
 * @class Form
 * @classdesc Handle contact form posting — hooked into Squarespace integration.
 *
 */
class Form {
    constructor ( element, data ) {
        this.data = data;
        this.element = element;
        this.script = this.element.find( "script" ).detach();
        this.blockJson = JSON.parse( this.script[ 0 ].textContent );
        this.formData = {};

        this.init();
        this.bind();
    }


    init () {
        this.element[ 0 ].innerHTML = views[ this.data.block ]( this );
        this.inputs = this.element.find( ".js-form-input" );
        this.selects = this.element.find( ".js-form-select" );
        this.selwraps = this.selects.parent();
        this.submit = this.element.find( ".js-form-submit" );
        this.message = this.element.find( ".js-form-message" );
    }


    bind () {
        this.submit.on( "click", ( e ) => {
            e.preventDefault();
            this.gather();
            this.send();
            return false;
        });

        this.selects.on( "change", ( e ) => {
            const target = $( e.target );

            if ( e.target.selectedIndex > 0 ) {
                target.addClass( "is-selected" );

            } else {
                target.removeClass( "is-selected" );
            }
        });
    }


    clear () {
        this.formData = {};
        this.clearFields();
        this.inputs.forEach(( el ) => {
            if ( /^select/.test( el.name ) ) {
                el.selectedIndex = 0;

            } else if ( /^radio/.test( el.name ) || /^checkbox/.test( el.name ) ) {
                el.checked = false;

            } else {
                el.value = "";
            }
        });
    }


    clearFields () {
        this.selwraps.removeClass( "is-error is-success" );
        this.inputs.removeClass( "is-error is-success" );
    }


    reset () {
        this.element.removeClass( "is-success" );
    }


    getKey () {
        return $.ajax({
            url: "/api/form/FormSubmissionKey",
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            dataType: "json"
        });
    }


    getCollectionId () {
        return this.blockJson.collectionId || "";
    }


    getPageId () {
        return this.blockJson.collection ? this.blockJson.collection.id : router.doc.data.collectionId;
    }


    getPagePath () {
        return this.blockJson.collection ? this.blockJson.collection.fullUrl : window.location.pathname;
    }


    getPageTitle () {
        return this.blockJson.collection ? this.blockJson.collection.title : document.title;
    }


    getSubmitMessage () {
        return this.blockJson.formSubmissionHTML || this.blockJson.form.submissionHTML;
    }


    saveForm ( key ) {
        return $.ajax({
            url: "/api/form/SaveFormSubmission",
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            dataType: "text",
            payload: {
                contentSource: "c",
                collectionId: this.getCollectionId(),
                form: JSON.stringify( this.formData ),
                formId: this.blockJson.formId,
                key,
                objectName: this.blockJson.objectName,
                pageId: this.getPageId(),
                pagePath: this.getPagePath(),
                pageTitle: this.getPageTitle()
            }
        });
    }


    gather () {
        this.formData = {};
        this.inputs.forEach(( el ) => {
            if ( /^phone/.test( el.name ) ) {
                // Sanitize all non-digit characters from the value
                // EG: (555) 555-5555 becomes 5555555555
                const phone = el.value.replace( /\D/g, "" );

                // This will handle US phone numbers fairly well...
                this.formData[ el.name ] = [
                    phone.slice( 0, phone.length - 10 ),
                    phone.slice( phone.length - 10, phone.length - 7 ),
                    phone.slice( phone.length - 7, phone.length - 4 ),
                    phone.slice( phone.length - 4, phone.length )
                ];

            } else if ( /^name/.test( el.name ) ) {
                this.formData[ el.name ] = el.value.split( " " );

                // Allow single name only ( first name )
                if ( this.formData[ el.name ].length === 1 ) {
                    this.formData[ el.name ].push( "." );
                }

            } else if ( /^radio/.test( el.name ) || /^checkbox/.test( el.name ) ) {
                if ( el.checked ) {
                    this.formData[ el.name ] = el.value;
                }

            } else {
                this.formData[ el.name ] = el.value;
            }
        });
    }


    handle ( response ) {
        if ( response ) {
            try {
                response = JSON.parse( response );

            } catch ( error ) {
                core.log( "warn", error );
            }

            if ( response && response.errors ) {
                this.handleErrors( response );
            }

        } else {
             this.handleSuccess( response );
        }
    }


    handleSuccess () {
        this.message[ 0 ].innerHTML = this.getSubmitMessage().replace( "{name}", this.getName() ).replace( "{select}", this.getSelect() );
        this.element.addClass( "is-success" );
        this.clear();
    }


    handleErrors ( response ) {
        for ( const i in response.errors ) {
            if ( response.errors.hasOwnProperty( i ) ) {
                const elem = this.inputs.filter( `[name='${i}']` );

                elem.addClass( "is-error" );

                if ( /^select/.test( elem[ 0 ].name ) ) {
                    elem.parent().addClass( "is-error" );
                }
            }
        }

        this.inputs.not( ".is-error" ).addClass( "is-success" );
        this.selwraps.not( ".is-error" ).addClass( "is-success" );
    }


    getName () {
        const name = this.inputs.filter( `[type="name"]` );

        return name[ 0 ] ? name[ 0 ].value : "";
    }


    getSelect () {
        return this.selects[ 0 ] ? this.selects[ 0 ].value : "";
    }


    send () {
        this.clearFields();
        this.getKey().then(( json ) => {
            this.saveForm( json.key ).then(( response ) => {
                this.handle( response );

            }).catch(( response ) => {
                this.handle( response );
            });

        }).catch(( error ) => {
            core.log( "warn", error );
        });
    }


    destroy () {}
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Form;
