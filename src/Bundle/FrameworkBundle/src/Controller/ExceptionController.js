const Response = Jymfony.Component.HttpFoundation.Response;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Controller
 */
class ExceptionController {
    __construct(debug) {
        this._debug = debug;
    }

    /**
     * Converts an exception to a Response.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     */
    showAction(request) {
        const exception = request.attributes.get('exception');

        return new Response(JSON.stringify(exception));
    }
}

module.exports = ExceptionController;
