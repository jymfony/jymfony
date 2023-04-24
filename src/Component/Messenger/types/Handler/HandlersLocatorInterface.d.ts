declare namespace Jymfony.Component.Messenger.Handler {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    /**
     * Maps a message to a list of handlers.
     */
    export class HandlersLocatorInterface {
        public static readonly definition: Newable<HandlersLocatorInterface>;

        /**
         * Returns the handlers for the given message name.
         *
         * @returns {Iterable<Jymfony.Component.Messenger.Handler.HandlerDescriptor>}
         */
        getHandlers(envelope: Envelope): Iterator<HandlerDescriptor>;
    }
}
