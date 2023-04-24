declare namespace Jymfony.Component.Messenger.Transport.Receiver {
    export class MessageCountAwareInterface {
        public static readonly definition: Newable<MessageCountAwareInterface>;

        /**
         * Returns the number of messages waiting to be handled.
         *
         * In some systems, this may be an approximate number.
         */
        public readonly messageCount: number;
    }
}
