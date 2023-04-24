/**
 * Creates a Messenger transport.
 *
 * @memberOf Jymfony.Component.Messenger.Transport
 */
class TransportFactoryInterface {
    /**
     * @param {string} dsn
     * @param {*} options
     * @param {Jymfony.Component.Messenger.Transport.Serialization} serializer
     *
     * @returns {Promise<Jymfony.Component.Messenger.Transport.TransportInterface>}
     */
    async createTransport(dsn, options, serializer) { }

    /**
     * @param {string} dsn
     * @param {*} options
     *
     * @returns {boolean}
     */
    supports(dsn, options) { }
}

export default getInterface(TransportFactoryInterface);
