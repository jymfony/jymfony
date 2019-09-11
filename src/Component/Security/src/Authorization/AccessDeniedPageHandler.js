const Request = Jymfony.Component.HttpFoundation.Request;
const AccessDeniedHandlerInterface = Jymfony.Component.Security.Authorization.AccessDeniedHandlerInterface;
const Security = Jymfony.Component.Security.Security;

/**
 * Handles an AccessDeniedException rendering a page.
 *
 * @memberOf Jymfony.Component.Security.Authorization
 */
export default class AccessDeniedPageHandler extends implementationOf(AccessDeniedHandlerInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Security.Http.HttpUtils} httpUtils
     * @param {Jymfony.Component.HttpServer.RequestHandler} httpServer
     * @param {string} route
     */
    __construct(httpUtils, httpServer, route) {
        /**
         * @type {Jymfony.Component.Security.Http.HttpUtils}
         *
         * @private
         */
        this._httpUtils = httpUtils;

        /**
         * @type {Jymfony.Component.HttpServer.RequestHandler}
         *
         * @private
         */
        this._requestHandler = httpServer;

        /**
         * @type {string}
         *
         * @private
         */
        this._route = route;
    }

    /**
     * @inheritdoc
     */
    async handle(request, exception) {
        if (request.attributes.has(Request.ATTRIBUTE_PARENT_REQUEST)) {
            return; // Avoid loops
        }

        const route = this._httpUtils.generateUri(request, this._route);
        const subRequest = Request.create(route, Request.METHOD_GET, {}, request.headers.all, request.server.all);
        subRequest.attributes.set(Security.ACCESS_DENIED_ERROR, exception);

        return this._requestHandler.handle(subRequest);
    }
}
