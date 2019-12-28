import { @Type } from '@jymfony/decorators';

const Response = Jymfony.Component.HttpFoundation.Response;
const Request = Jymfony.Component.HttpFoundation.Request;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Controller
 */
export default class ExceptionController {
    /**
     * Constructor.
     *
     * @param {boolean} debug
     */
    __construct(debug) {
        this._debug = debug;
    }

    /**
     * Converts an exception to a Response.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     */
    showAction(@Type(Request) request) {
        let exception = request.attributes.get('exception');

        if (! this._debug) {
            exception = {
                code: exception.code,
                message: exception.message,
            };
        }

        return new Response(JSON.stringify(exception), 200, {
            'content-type': 'application/json',
        });
    }
}
