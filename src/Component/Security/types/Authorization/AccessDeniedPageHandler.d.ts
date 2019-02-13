declare namespace Jymfony.Component.Security.Authorization {
    import HttpUtils = Jymfony.Component.Security.Http.HttpUtils;
    import RequestHandler = Jymfony.Component.HttpServer.RequestHandler;
    import Request = Jymfony.Component.HttpFoundation.Request;
    import AccessDeniedException = Jymfony.Component.Security.Exception.AccessDeniedException;
    import Response = Jymfony.Component.HttpFoundation.Response;

    /**
     * Handles an AccessDeniedException rendering a page.
     */
    export class AccessDeniedPageHandler extends implementationOf(AccessDeniedHandlerInterface) {
        private _httpUtils: HttpUtils;
        private _requestHandler: RequestHandler;
        private _route: string;

        /**
         * Constructor.
         */
        __construct(httpUtils: HttpUtils, httpServer: RequestHandler, route: string): void;
        constructor(httpUtils: HttpUtils, httpServer: RequestHandler, route: string);

        /**
         * @inheritdoc
         */
        handle(request: Request, exception: AccessDeniedException): Promise<Response>;
    }
}
