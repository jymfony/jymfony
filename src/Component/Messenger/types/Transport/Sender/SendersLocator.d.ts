declare namespace Jymfony.Component.Messenger.Transport.Sender {
    import ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;
    import Envelope = Jymfony.Component.Messenger.Envelope;

    /**
     * Maps a message to a list of senders.
     */
    export class SendersLocator extends implementationOf(SendersLocatorInterface) {
        private _sendersMap: Record<string, string[]>;
        private _sendersLocator: ContainerInterface;

        /**
         * Constructor.
         *
         * @param sendersMap A map, keyed by "type", set to an array of sender aliases
         * @param sendersLocator Locator of senders, keyed by sender alias
         */
        __construct(sendersMap: Record<string, string[]>, sendersLocator: ContainerInterface): void;

        constructor(sendersMap: Record<string, string[]>, sendersLocator: ContainerInterface);

        /**
         * @inheritdoc
         */
        getSenders(envelope: Envelope): Record<string, SenderInterface>;
    }
}
