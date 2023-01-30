const TransportFactoryInterface = Jymfony.Component.Messenger.Transport.TransportFactoryInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Transport
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
     * @param {string} dsn
     * @param {*} options
     * @param {Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface} serializer
     *
     * @returns {Jymfony.Component.Messenger.Transport.TransportInterface}
     */
    createTransport(dsn, options, serializer) {
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

        return {
            serialize: !!url.searchParams.get('serialize'),
        };
    }
}
