const AbstractSessionListener = Jymfony.Component.HttpServer.EventListener.AbstractSessionListener;
const Session = Jymfony.Component.HttpFoundation.Session.Session;

/**
 * @memberOf Jymfony.Component.HttpServer.EventListener
 * @final
 */
export default class SessionListener extends AbstractSessionListener {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerInterface} container
     * @param {string} storageId
     * @param {int} cookieLifetime
     * @param {string} cookiePath
     * @param {undefined | string} cookieDomain
     * @param {boolean} cookieSecure
     * @param {boolean} cookieHttpOnly
     */
    __construct(container, storageId, cookieLifetime = 0, cookiePath = '/', cookieDomain = undefined, cookieSecure = true, cookieHttpOnly = true) {
        super.__construct(cookieLifetime, cookiePath, cookieDomain, cookieSecure, cookieHttpOnly);

        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerInterface}
         *
         * @private
         */
        this._container = container;

        /**
         * @type {string}
         *
         * @private
         */
        this._storageId = storageId;
    }

    /**
     * @inheritdoc
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     */
    getSession(request) {
        const storage = this._container.get(this._storageId);
        if (request.cookies.has(storage.name)) {
            storage.id = request.cookies.get(storage.name);
        }

        return new Session(storage);
    }
}
