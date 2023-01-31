const SyncTransport = Jymfony.Component.Messenger.Transport.Sync.SyncTransport;
const TransportFactoryInterface = Jymfony.Component.Messenger.Transport.TransportFactoryInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Transport.Sync
 */
export default class SyncTransportFactory extends implementationOf(TransportFactoryInterface) {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Jymfony.Component.Messenger.MessageBusInterface}
         *
         * @private
         */
        this._messageBus = undefined;
    }

    createTransport() {
        return new SyncTransport(this._messageBus);
    }

    supports(dsn) {
        return dsn.startsWith('sync://');
    }
}
