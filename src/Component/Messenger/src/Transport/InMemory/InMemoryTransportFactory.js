const InMemoryTransport = Jymfony.Component.Messenger.Transport.InMemory.InMemoryTransport;
const TransportFactoryInterface = Jymfony.Component.Messenger.Transport.TransportFactoryInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Transport.InMemory
 */
export default class InMemoryTransportFactory extends implementationOf(TransportFactoryInterface) {
    __construct() {
        /**
         * @type {Jymfony.Component.Messenger.Transport.InMemoryTransport[]}
         *
         * @private
         */
        this._createdTransports = [];
    }

    /**
     * @inheritDoc
     */
    async createTransport(dsn, options, serializer) {
        const { serialize } = this._parseDsn(dsn);

        const transport = new InMemoryTransport(serialize ? serializer : null);
        this._createdTransports.push(transport);

        return transport;
    }

    /**
     * @param {string} dsn
     *
     * @returns {boolean}
     */
    supports(dsn) {
        return dsn.startsWith('in-memory://');
    }

    /**
     * @param {string} dsn
     * @returns {{serialize: boolean}}
     *
     * @private
     */
    _parseDsn(dsn) {
        const url = new URL(dsn);
        let serialize = url.searchParams.get('serialize');
        serialize = serialize && '0' !== serialize && 'false' !== serialize.toLowerCase();

        return { serialize };
    }
}
