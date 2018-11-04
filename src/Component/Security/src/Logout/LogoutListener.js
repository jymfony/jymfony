const RedirectResponse = Jymfony.Component.HttpFoundation.RedirectResponse;
const ListenerInterface = Jymfony.Component.Security.Firewall.ListenerInterface;

/**
 * @memberOf Jymfony.Component.Security.Logout
 */
class LogoutListener extends implementationOf(ListenerInterface) {
    /**
     * Constuctor.
     *
     * @param {Jymfony.Component.Security.Http.HttpUtils} httpUtils
     * @param {string} logoutPath
     * @param {string} [targetPath = "/"]
     */
    __construct(httpUtils, logoutPath, targetPath = '/') {
        /**
         * @type {Jymfony.Component.Security.Http.HttpUtils}
         *
         * @private
         */
        this._httpUtils = httpUtils;

        /**
         * @type {string}
         *
         * @private
         */
        this._path = logoutPath;

        /**
         * @type {string}
         *
         * @private
         */
        this._targetPath = targetPath;

        /**
         * @type {Jymfony.Component.Security.Logout.LogoutHandlerInterface[]}
         *
         * @private
         */
        this._handlers = [];
    }

    /**
     * Adds a logout handler to this listener.
     *
     * @param {Jymfony.Component.Security.Logout.LogoutHandlerInterface} handler
     */
    addHandler(handler) {
        this._handlers.push(handler);
    }

    /**
     * @inheritdoc
     */
    async handle(event) {
        const request = event.request;
        if (! this._httpUtils.checkRequestPath(request, this._path)) {
            return;
        }

        const response = new RedirectResponse(this._httpUtils.generateUri(request, this._targetPath));

        for (const handler of this._handlers) {
            await handler.logout(request, response);
        }

        event.response = response;
    }
}

module.exports = LogoutListener;
