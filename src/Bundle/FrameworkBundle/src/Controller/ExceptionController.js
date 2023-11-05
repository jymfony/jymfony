const Response = Jymfony.Component.HttpFoundation.Response;
const Request = Jymfony.Component.HttpFoundation.Request;
const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Controller
 */
export default class ExceptionController {
    /**
     * @type {boolean}
     *
     * @private
     */
    _debug;

    /**
     * @type {Jymfony.Component.Debug.ErrorRenderer.ErrorRendererInterface}
     *
     * @private
     */
    _errorRenderer;

    /**
     * Constructor.
     *
     * @param {boolean} debug
     * @param {Jymfony.Component.Debug.ErrorRenderer.ErrorRendererInterface} errorRenderer
     */
    __construct(debug, errorRenderer) {
        this._debug = debug;
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
