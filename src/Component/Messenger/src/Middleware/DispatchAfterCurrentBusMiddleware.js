const DelayedMessageHandlingException = Jymfony.Component.Messenger.Exception.DelayedMessageHandlingException;
const DispatchAfterCurrentBusStamp = Jymfony.Component.Messenger.Stamp.DispatchAfterCurrentBusStamp;
const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;

/**
 * @internal
 * @final
 */
class QueuedEnvelope {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     * @param {Jymfony.Component.Messenger.Middleware.StackInterface} stack
     */
    __construct(envelope, stack) {
        /**
         * @type {Jymfony.Component.Messenger.Envelope}
         *
         * @private
         */
        this._envelope = envelope.withoutAllStamps(DispatchAfterCurrentBusStamp);

        /**
         * @type {Jymfony.Component.Messenger.Middleware.StackInterface}
         *
         * @private
         */
        this._stack = stack;
    }

    /**
     * @returns {Jymfony.Component.Messenger.Envelope}
     */
    get envelope() {
        return this._envelope;
    }

    /**
     * @returns {Jymfony.Component.Messenger.Middleware.StackInterface}
     */
    get stack() {
        return this._stack;
    }
}

/**
 * Allow to configure messages to be handled after the current bus is finished.
 *
 * I.e, messages dispatched from a handler with a DispatchAfterCurrentBus stamp
 * will actually be handled once the current message being dispatched is fully
 * handled.
 *
 * For instance, using this middleware before the DoctrineTransactionMiddleware
 * means sub-dispatched messages with a DispatchAfterCurrentBus stamp would be
 * handled after the Doctrine transaction has been committed.
 *
 * @memberOf Jymfony.Component.Messenger.Middleware
 */
export default class DispatchAfterCurrentBusMiddleware extends implementationOf(MiddlewareInterface) {
    __construct() {
        /**
         * A queue of messages and next middleware
         *
         * @type {QueuedEnvelope[]}
         */
        this._queue = [];

        /**
         * This property is used to signal if we are inside the first/root call to
         * MessageBusInterface.dispatch() or if dispatch has been called inside a message handler
         *
         * @type {boolean}
         */
        this._isRootDispatchCallRunning = false;
    }

    async handle(envelope, stack) {
        if (null !== envelope.last(DispatchAfterCurrentBusStamp)) {
            if (this._isRootDispatchCallRunning) {
                this._queue.push(new QueuedEnvelope(envelope, stack));

                return envelope;
            }

            envelope = envelope.withoutAllStamps(DispatchAfterCurrentBusStamp);
        }

        if (this._isRootDispatchCallRunning) {
            /*
             * A call to MessageBusInterface.dispatch() was made from inside the main bus handling,
             * but the message does not have the stamp. So, process it like normal.
             */
            return stack.next().handle(envelope, stack);
        }

        let returnedEnvelope;

        // First time we get here, mark as inside a "root dispatch" call:
        this._isRootDispatchCallRunning = true;
        try {
            // Execute the whole middleware stack & message handling for main dispatch:
            returnedEnvelope = await stack.next().handle(envelope, stack);
        } catch (exception) {
            /*
             * Whenever an exception occurs while handling a message that has
             * queued other messages, we drop the queued ones.
             * This is intentional since the queued commands were likely dependent
             * on the preceding command.
             */
            this._queue = [];
            this._isRootDispatchCallRunning = false;

            throw exception;
        }

        // "Root dispatch" call is finished, dispatch stored messages.
        const exceptions = [];
        let queueItem;
        while (null !== (queueItem = this._queue.shift())) {
            // Save how many messages are left in queue before handling the message
            const queueLengthBefore = this._queue.length;
            try {
                // Execute the stored messages
                await queueItem.stack.next().handle(queueItem.envelope, queueItem.stack);
            } catch (exception) {
                // Gather all exceptions
                exceptions.push(exception);
                // Restore queue to previous state
                this._queue = this._queue.slice(0, queueLengthBefore);
            }
        }

        this._isRootDispatchCallRunning = false;
        if (0 < exceptions.length) {
            throw new DelayedMessageHandlingException(exceptions);
        }

        return returnedEnvelope;
    }
}
