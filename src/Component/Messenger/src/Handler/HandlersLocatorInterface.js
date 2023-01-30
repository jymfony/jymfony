/**
 * Maps a message to a list of handlers.
 *
 * @memberOf Jymfony.Component.Messenger.Handler
 */
class HandlersLocatorInterface {
    /**
     * Returns the handlers for the given message name.
     *
     * @returns {Iterable<Jymfony.Component.Messenger.Handler.HandlerDescriptor>}
     */
    getHandlers(envelope) { }
}

export default getInterface(HandlersLocatorInterface);
