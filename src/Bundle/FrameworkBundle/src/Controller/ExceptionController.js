const Response = Jymfony.Component.HttpFoundation.Response;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Controller
 */
class ExceptionController {
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
    showAction(request) {
        const exception = request.attributes.get('exception');

        return new Response(JSON.stringify(exception), 200, {
            'content-type': 'application/json',
        });
    }
}

module.exports = ExceptionController;
