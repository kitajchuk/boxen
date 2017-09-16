import $ from "properjs-hobo";
import * as core from "../core";



/**
 *
 * @public
 * @global
 * @class FormController
 * @classdesc Handle form posting.
 *
 */
class FormController {
    constructor ( element ) {
        this.element = element;
        this.fields = this.element.find( ".js-form-field" );
        this.placeholder = this.element.closest( ".js-placeholder" );
        this.validations = {
            email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        };

        this.bind();
    }


    isValid () {
        let ret = true;

        this.fields.forEach(( field ) => {
            if ( !this.validations[ field.type ].test( field.value ) ) {
                ret = false;
            }
        });

        return ret;
    }


    bind () {
        this.element.on( "submit", ( e ) => {
            e.preventDefault();

            if ( this.isValid() ) {
                this.send();
            }

            return false;
        });
    }


    data () {
        const data = {};

        this.fields.forEach(( field ) => {
            data[ field.name ] = field.value;
        });

        return data;
    }


    clear () {
        this.fields.forEach(( field ) => {
            field.value = "";
        });
    }


    send () {
        const data = this.data();
        const headers = {};

        if ( /^post/i.test( this.element[ 0 ].method ) ) {
            headers[ "Content-Type" ] = "application/x-www-form-urlencoded";
        }

        $.ajax({
            url: this.element[ 0 ].action,
            method: this.element[ 0 ].method,
            data,
            headers
        })
        .then(( /*response*/ ) => {
            this.clear();

            if ( this.placeholder.length ) {
                this.placeholder.addClass( "is-placeholder" );
            }
        })
        .catch(( error ) => {
            core.log( "warn", error );
        });
    }


    destroy () {}
}



/******************************************************************************
 * Export
*******************************************************************************/
export default FormController;
