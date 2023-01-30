const SyncTransport = Jymfony.Component.Messenger.Transport.Sync.SyncTransport;
const TransportFactoryInterface = Jymfony.Component.Messenger.Transport.TransportFactoryInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Transport.Sync
 */
export default class SyncTransportFactory extends implementationOf(TransportFactoryInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.MessageBusInterface} messageBus
     */
    __construct(messageBus) {
        /**
         * @type {Jymfony.Component.Messenger.MessageBusInterface}
         *
         * @private
         */
        this._messageBus = messageBus;
    }

    createTransport() {
        return new SyncTransport(this._messageBus);
    }

    supports(dsn) {
        return dsn.startsWith('sync://');
    }
}
