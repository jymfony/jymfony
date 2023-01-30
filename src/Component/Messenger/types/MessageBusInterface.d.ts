declare namespace Jymfony.Component.Messenger {
    import StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;

    export class MessageBusInterface {
        public static readonly definition: Newable<MessageBusInterface>;

        /**
         * Dispatches the given message.
         *
         * @param {object|Jymfony.Component.Messenger.Envelope}  message The message or the message pre-wrapped in an envelope
         * @param {Jymfony.Component.Messenger.Stamp.StampInterface[]} [stamps]
         *
         * @returns {Promise<Jymfony.Component.Messenger.Envelope>}
         */
        dispatch<T extends object>(message: T | Envelope<T>, stamps?: StampInterface[]): Promise<Envelope<T>>;
    }
}
