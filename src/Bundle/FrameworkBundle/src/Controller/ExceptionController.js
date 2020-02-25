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
     * @param {Jymfony.Component.Debug.ErrorRenderer.ErrorRendererInterface} errorRenderer
     */
    __construct(debug, errorRenderer) {
        /**
         * @type {boolean}
         *
         * @private
         */
        this._debug = debug;

        /**
         * @type {Jymfony.Component.Debug.ErrorRenderer.ErrorRendererInterface}
         *
         * @private
         */
        this._errorRenderer = errorRenderer;
    }

    /**
     * Converts an exception to a Response.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     */
    showAction(@Type(Request) request) {
        const exception = request.attributes.get('exception');
        const flattenException = this._errorRenderer.render(exception);

        return new Response(flattenException.asString, flattenException.statusCode, flattenException.headers);
    }
}
