const HandlersLocator = Jymfony.Component.Messenger.Handler.HandlersLocator;
const SendersLocatorInterface = Jymfony.Component.Messenger.Transport.Sender.SendersLocatorInterface;

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
     * @param {Jymfony.Component.DependencyInjection.ContainerInterface} sendersLocator Locator of senders, keyed by sender alias
     */
    __construct(sendersMap, sendersLocator) {
        /**
         * @type {Object.<string, string[]>}
         *
         * @private
         */
        this._sendersMap = sendersMap;

        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerInterface}
         *
         * @private
         */
        this._sendersLocator = sendersLocator;
    }

    /**
     * @inheritdoc
     */
    getSenders(envelope) {
        const seen = [];
        const result = {};

        for (const type of HandlersLocator.listTypes(envelope)) {
            for (const senderAlias of this._sendersMap[type] || []) {
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
}
