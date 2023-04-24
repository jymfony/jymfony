const HandlersLocator = Jymfony.Component.Messenger.Handler.HandlersLocator;
const SendersLocatorInterface = Jymfony.Component.Messenger.Transport.Sender.SendersLocatorInterface;
const TransportNamesStamp = Jymfony.Component.Messenger.Stamp.TransportNamesStamp;

/**
 * Maps a message to a list of senders.
 *
 * @memberOf Jymfony.Component.Messenger.Transport.Sender
 */
export default class SendersLocator extends implementationOf(SendersLocatorInterface) {
    /**
     * Constructor.
     *
     * @param {Object.<string, string[]>} sendersMap An array, keyed by "type", set to an array of sender aliases
     * @param {Jymfony.Contracts.DependencyInjection.ContainerInterface} sendersLocator Locator of senders, keyed by sender alias
     */
    __construct(sendersMap, sendersLocator) {
        /**
         * @type {Object.<string, string[]>}
         *
         * @private
         */
        this._sendersMap = sendersMap;

        /**
         * @type {Jymfony.Contracts.DependencyInjection.ContainerInterface}
         *
         * @private
         */
        this._sendersLocator = sendersLocator;
    }

    /**
     * @inheritdoc
     */
    getSenders(envelope) {
        const result = {};
        const transportNames = envelope.last(TransportNamesStamp);
        if (null !== transportNames) {
            for (const senderAlias of transportNames.transportNames) {
                for (const sender of this._getSenderFromAlias(senderAlias)) {
                    result[senderAlias] = sender;
                }
            }

            return result;
        }

        const seen = [];
        for (const type of HandlersLocator.listTypes(envelope)) {
            for (const senderAlias of this._sendersMap[type] || []) {
                if (type.endsWith('*') && 0 < seen.length) {
                    // The '*' acts as a fallback, if other senders already matched with previous types, skip the senders bound to the fallback
                    continue;
                }

                if (! seen.includes(senderAlias)) {
                    if (! this._sendersLocator.has(senderAlias)) {
                        throw new RuntimeException(__jymfony.sprintf('Invalid senders configuration: sender "%s" is not in the senders locator.', senderAlias));
                    }

                    seen.push(senderAlias);
                    result[senderAlias] = this._sendersLocator.get(senderAlias);
                }
            }
        }

        return result;
    }

    * _getSenderFromAlias(senderAlias) {
        if (! this._sendersLocator.has(senderAlias)) {
            throw new RuntimeException(__jymfony.sprintf('Invalid senders configuration: sender "%s" is not in the senders locator.', senderAlias));
        }

        yield this._sendersLocator.get(senderAlias);
    }
}
