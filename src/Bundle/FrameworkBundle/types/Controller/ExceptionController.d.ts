declare namespace Jymfony.Bundle.FrameworkBundle.Controller {
    import ErrorRendererInterface = Jymfony.Component.Debug.ErrorRenderer.ErrorRendererInterface;
    import Request = Jymfony.Component.HttpFoundation.Request;
    import Response = Jymfony.Component.HttpFoundation.Response;

    export class ExceptionController {
        private _debug: boolean;

        /**
         * Constructor.
         */
        __construct(debug: boolean, errorRenderer: ErrorRendererInterface): void;
        constructor(debug: boolean, errorRenderer: ErrorRendererInterface);

        /**
         * Converts an exception to a Response.
         */
        showAction(request: Request): Response;
    }
}
