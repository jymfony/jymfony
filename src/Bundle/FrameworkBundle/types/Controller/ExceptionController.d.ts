declare namespace Jymfony.Bundle.FrameworkBundle.Controller {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import Response = Jymfony.Component.HttpFoundation.Response;

    export class ExceptionController {
        private _debug: boolean;

        /**
         * Constructor.
         */
        __construct(debug: boolean): void;
        constructor(debug: boolean);

        /**
         * Converts an exception to a Response.
         */
        showAction(request: Request): Response;
    }
}
