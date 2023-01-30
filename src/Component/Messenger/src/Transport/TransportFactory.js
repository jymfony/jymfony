const TransportFactoryInterface = Jymfony.Component.Messenger.Transport.TransportFactoryInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Transport
 */
export default class TransportFactory extends implementationOf(TransportFactoryInterface) {
    /**
     * @param {Jymfony.Component.Messenger.Transport.TransportFactoryInterface[]} factories
     */
    __construct(factories) {
        /**
         * @type {Jymfony.Component.Messenger.Transport.TransportFactoryInterface[]}
         *
         * @private
         */
        this._factories = factories;
    }

    async createTransport(dsn, options, serializer) {
        for (const factory of this._factories) {
            if (factory.supports(dsn, options)) {
                return await factory.createTransport(dsn, options, serializer);
            }
        }

        // Help the user to select jymfony packages based on protocol.
        let packageSuggestion = '';
        if (dsn.startsWith('amqp://')) {
            packageSuggestion = ' Run "npm install @jymfony/amqp-messenger" to install AMQP transport.';
        } else if (dsn.startsWith('redis://') || dsn.startsWith('rediss://')) {
            packageSuggestion = ' Run "npm install @jymfony/redis-messenger" to install Redis transport.';
        } else if (dsn.startsWith('sqs://') || dsn.match(/^https:\/\/sqs.[w-]+.amazonaws.com\/.+/)) {
            packageSuggestion = ' Run "npm install @jymfony/amazon-sqs-messenger" to install Amazon SQS transport.';
        } else if (dsn.startsWith('beanstalkd://')) {
            packageSuggestion = ' Run "npm install @jymfony/beanstalkd-messenger" to install Beanstalkd transport.';
        }

        throw new InvalidArgumentException(__jymfony.sprintf('No transport supports the given Messenger DSN "%s".%s.', dsn, packageSuggestion));
    }

    supports(dsn, options) {
        return this._factories.some(factory => factory.supports(dsn, options));
    }
}
