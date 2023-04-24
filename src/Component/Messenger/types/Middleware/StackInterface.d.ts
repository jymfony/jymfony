declare namespace Jymfony.Component.Messenger.Middleware {
    /**
     * Implementations must be cloneable, and each clone must unstack the stack independently.
     */
    class StackInterface {
        /**
         * Returns the next middleware to process a message.
         *
         * @returns {Jymfony.Component.Messenger.Middleware.MiddlewareInterface}
         */
        next(): MiddlewareInterface;
    }
}
