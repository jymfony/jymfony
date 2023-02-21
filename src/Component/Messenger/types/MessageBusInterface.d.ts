declare namespace Jymfony.Component.Messenger {
    import StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;

    export class MessageBusInterface {
        public static readonly definition: Newable<MessageBusInterface>;

        /**
         * Dispatches the given message.
         *
         * @param message The message or the message pre-wrapped in an envelope
         * @param stamps
         */
        dispatch<T extends object>(message: T | Envelope<T>, stamps?: StampInterface[]): Promise<Envelope<T>>;
    }
}
