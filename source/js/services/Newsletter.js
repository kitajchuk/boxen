import $ from "properjs-hobo";
import * as core from "../core";
import viewNewsletter from "../views/newsletter";
import debounce from "properjs-debounce";



class Newsletter {
    constructor ( element ) {
        this.element = element;
        this.script = this.element.find( "script" ).detach();
        this.blockJson = JSON.parse( this.script[ 0 ].textContent );
        this.pageId = "5cafe53bb208fcfd8dc661dd";
        this.data = {};
        this.waiting = 300;
        this.validators = {
            email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        };

        this.load().then(() => {
            this.bind();
        });
    }


    load () {
        return new Promise(( resolve ) => {
            this.element[ 0 ].innerHTML = viewNewsletter( this );
            this.field = this.element.find( ".js-newsletter-field" );
            this.button = this.element.find( ".js-newsletter-btn" );
            resolve();
        });
    }


    bind () {
        this.button.on( "click", () => {
            if ( this.validators.email.test( this.field[ 0 ].value ) ) {
                this.gather();
                this.send();

            } else {
                this.alert = new window.Y.Squarespace.Widgets.Alert({
                    "strings.title": "Deem Journal",
                    "strings.message": "Please fill out a valid and complete Email Address."
                });
            }
        });

        this.field.on( "keyup", debounce(() => {
            if ( !this.field[ 0 ].value ) {
                this.field.removeClass( "is-invalid" );
                this.element.removeClass( "is-valid" );

            } else if ( this.validators.email.test( this.field[ 0 ].value ) ) {
                this.field.removeClass( "is-invalid" );
                this.element.addClass( "is-valid" );

            } else {
                this.field.addClass( "is-invalid" );
                this.element.removeClass( "is-valid" );
            }

        }, this.waiting ));
    }


    clear () {
        this.data = {};
        this.field.removeClass( "is-error" );
        this.field[ 0 ].value = "";
    }


    reset () {
        this.element.removeClass( "is-success is-sending" );
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


    sendForm ( key ) {
        return $.ajax({
            url: "/api/form/SaveFormSubmission",
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            dataType: "html",
            payload: {
                collectionId: "",
                contentSource: "c",
                form: JSON.stringify( this.data ),
                formId: this.blockJson.formId,
                key,
                objectName: this.blockJson.objectName,
                pageId: this.pageId,
                pagePath: window.location.pathname,
                pageTitle: document.title
            }
        });
    }


    gather () {
        this.data = {};
        this.data[ this.field[ 0 ].name ] = this.field[ 0 ].value;
    }


    handle ( response ) {
        this.element.removeClass( "is-sending" );

        try {
            response = JSON.parse( response );

        } catch ( parseError ) {
            core.log( "warn", parseError );
        }

        if ( (typeof response === "object") && response.errors ) {
            for ( const i in response.errors ) {
                if ( response.errors.hasOwnProperty( i ) ) {
                    this.field.addClass( "is-error" );
                }
            }

        } else {
            this.element.addClass( "is-success" );
        }
    }


    send () {
        this.field.removeClass( "is-error" );
        this.element.addClass( "is-sending" );
        this.getKey().then(( json ) => {
            this.sendForm( json.key ).then(( response ) => {
                this.handle( response );

            }).catch(( response ) => {
                this.handle( response );
            });

        }).catch( () => {} );
    }


    destroy () {}
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Newsletter;
