/**
 * Implementations must be cloneable, and each clone must unstack the stack independently.
 *
 * @memberOf Jymfony.Component.Messenger.Middleware
 */
class StackInterface {
    /**
     * Returns the next middleware to process a message.
     *
     * @returns {Jymfony.Component.Messenger.Middleware.MiddlewareInterface}
     */
    next() { }
}

export default getInterface(StackInterface);
