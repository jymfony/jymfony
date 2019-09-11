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
     */
    __construct(container, storageId) {
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
     */
    getSession() {
        return new Session(this._container.get(this._storageId));
    }
}
