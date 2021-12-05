const Cookie = Jymfony.Component.HttpFoundation.Cookie;
const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const HttpServerEvents = Jymfony.Component.HttpServer.Event.HttpServerEvents;

/**
 * Sets the session onto the request on the "kernel.request" event and saves
 * it on the "kernel.response" event.
 *
 * In addition, if the session has been started it overrides the Cache-Control
 * header in such a way that all caching is disabled in that case.
 *
 * @memberOf Jymfony.Component.HttpServer.EventListener
 * @abstract
 */
export default class AbstractSessionListener extends implementationOf(EventSubscriberInterface) {
    /**
     * Constructor.
     *
     * @param {int} cookieLifetime
     * @param {string} cookiePath
     * @param {undefined | string} cookieDomain
     * @param {boolean} cookieSecure
     * @param {boolean} cookieHttpOnly
     */
    __construct(cookieLifetime = 0, cookiePath = '/', cookieDomain = undefined, cookieSecure = true, cookieHttpOnly = true) {
        /**
         * @type {number}
         *
         * @private
         */
        this._cookieLifetime = cookieLifetime;

        /**
         * @type {string}
         *
         * @private
         */
        this._cookiePath = cookiePath;

        /**
         * @type {string}
         *
         * @private
         */
        this._cookieDomain = cookieDomain;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._cookieSecure = cookieSecure;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._cookieHttpOnly = cookieHttpOnly;
    }

    /**
     * Listen on http.request to inject session factory
     *
     * @param {Jymfony.Contracts.HttpServer.Event.RequestEvent} event
     */
    onRequest(event) {
        const request = event.request;
        if (! request.hasSession()) {
            request._session = () => this.getSession(request);
        }
    }

    /**
     * Listen on http.request to inject session factory
     *
     * @param {Jymfony.Contracts.HttpServer.Event.ResponseEvent} event
     */
    async onResponse(event) {
        const request = event.request;
        const session = request._session;

        if (! session) {
            return;
        }

        const response = event.response;
        if (session.started) {
            response
                .setPrivate()
                .setMaxAge(0)
            ;

            const headers = response.headers;
            headers.addCacheControlDirective('must-revalidate');
            headers.setCookie(new Cookie(session.name, session.id, this._cookieLifetime, this._cookiePath, this._cookieDomain, this._cookieSecure, this._cookieHttpOnly));

            /*
             * Saves the session, in case it is still open, before sending the response/headers.
             *
             * This ensures several things in case the developer did not save the session explicitly:
             *
             *  * If a session save handler without locking is used, it ensures the data is available
             *    on the next request, e.g. after a redirect.
             *  * A locking save handler (e.g. the native 'files') circumvents concurrency problems like
             *    the one above. But by saving the session before long-running things in the terminate event,
             *    we ensure the session is not blocked longer than needed.
             *
             * This listener should be executed as one of the last listeners, so that previous listeners
             * can still operate on the open session. This prevents the overhead of restarting it.
             * Listeners after closing the session can still work with the session as usual because
             * Jymfony's session implementation starts the session on demand. So writing to it after
             * it is saved will just restart it.
             */
            await session.save();
        }
    }

    /**
     * @inheritdoc
     */
    static getSubscribedEvents() {
        return {
            [HttpServerEvents.REQUEST]: [ 'onRequest', 128 ],
            [HttpServerEvents.RESPONSE]: [ 'onResponse', -1000 ],
        };
    }

    /**
     * Gets the session object.
     *
     * @param {Jymfony.Contracts.HttpFoundation.RequestInterface} request
     *
     * @returns {SessionInterface} A SessionInterface instance or undefined if no session is available
     * @abstract
     */
    getSession(request) { } // eslint-disable-line no-unused-vars
}
