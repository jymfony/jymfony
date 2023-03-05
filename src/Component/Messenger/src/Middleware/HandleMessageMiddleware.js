const AckStamp = Jymfony.Component.Messenger.Stamp.AckStamp;
const Acknowledger = Jymfony.Component.Messenger.Handler.Acknowledger;
const FlushBatchHandlersStamp = Jymfony.Component.Messenger.Stamp.FlushBatchHandlersStamp;
const HandlerArgumentsStamp = Jymfony.Component.Messenger.Stamp.HandlerArgumentsStamp;
const HandlerFailedException = Jymfony.Component.Messenger.Exception.HandlerFailedException;
const HandledStamp = Jymfony.Component.Messenger.Stamp.HandledStamp;
const LoggerAwareTrait = Jymfony.Contracts.Logger.LoggerAwareTrait;
const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;
const NoAutoAckStamp = Jymfony.Component.Messenger.Stamp.NoAutoAckStamp;
const NoHandlerForMessageException = Jymfony.Component.Messenger.Exception.NoHandlerForMessageException;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;

/**
 * @memberOf Jymfony.Component.Messenger.Middleware
 */
export default class HandleMessageMiddleware extends implementationOf(MiddlewareInterface, LoggerAwareTrait) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.Handler.HandlersLocatorInterface} handlersLocator
     * @param {boolean} allowNoHandlers
     */
    __construct(handlersLocator, allowNoHandlers = false) {
        /**
         * @type {Jymfony.Component.Messenger.Handler.HandlersLocatorInterface}
         *
         * @private
         */
        this._handlersLocator = handlersLocator;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._allowNoHandlers = allowNoHandlers;

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = new NullLogger();
    }

    /**
     * @inheritDoc
     *
     * @throws {Jymfony.Component.Messenger.Exception.NoHandlerForMessageException} When no handler is found and allowNoHandlers is false
     */
    async handle(envelope, stack) {
        let handler = null;
        const { message } = envelope;

        const context = {
            class: ReflectionClass.getClassName(message),
        };

        const exceptions = [];
        let alreadyHandled = false;
        for (const handlerDescriptor of this._handlersLocator.getHandlers(envelope)) {
            if (this._messageHasAlreadyBeenHandled(envelope, handlerDescriptor)) {
                alreadyHandled = true;
                continue;
            }

            try {
                handler = handlerDescriptor.handler;
                const batchHandler = handlerDescriptor.batchHandler;

                /** @type {Jymfony.Component.Messenger.Stamp.AckStamp} ackStamp */
                let ackStamp;
                let result;
                if (!! batchHandler && (ackStamp = envelope.last(AckStamp))) {
                    const ack = new Acknowledger(__jymfony.get_debug_type(batchHandler), async (e = null, result = null) => {
                        if (null !== e) {
                            e = new HandlerFailedException(envelope, [ e ]);
                        } else {
                            envelope = envelope.withStamps(HandledStamp.fromDescriptor(handlerDescriptor, result));
                        }

                        await ackStamp.ack(envelope, e);
                    });

                    let result = await this._callHandler(handler, message, ack, envelope.last(HandlerArgumentsStamp));
                    if (! Number.isInteger(result) || 0 > result) {
                        throw new LogicException(__jymfony.sprintf('A handler implementing BatchHandlerInterface must return the size of the current batch as a positive integer, "%s" returned from "%s".', isNumber(result) ? result : __jymfony.get_debug_type(result), __jymfony.get_debug_type(batchHandler)));
                    }

                    if (! ack.isAcknowledged) {
                        envelope = envelope.withStamps(new NoAutoAckStamp(handlerDescriptor));
                    } else if (ack.error) {
                        throw ack.error;
                    } else {
                        result = ack.result;
                    }
                } else {
                    result = await this._callHandler(handler, message, null, envelope.last(HandlerArgumentsStamp));
                }

                const handledStamp = HandledStamp.fromDescriptor(handlerDescriptor, result);
                envelope = envelope.withStamps(handledStamp);
                this._logger.info('Message {class} handled by {handler}', { ...context, handler: handledStamp.handlerName });
            } catch (e) {
                exceptions.push(e);
            }
        }

        /** @type {Jymfony.Component.Messenger.Stamp.FlushBatchHandlersStamp} flushStamp */
        const flushStamp = envelope.last(FlushBatchHandlersStamp);
        if (!!flushStamp) {
            for (const stamp of envelope.all(NoAutoAckStamp)) {
                try {
                    const handler = stamp.handlerDescriptor.batchHandler;
                    await handler.flush(flushStamp.force);
                } catch (e) {
                    exceptions.push(e);
                }
            }
        }

        if (null === handler && !alreadyHandled) {
            if (!this._allowNoHandlers) {
                throw new NoHandlerForMessageException(__jymfony.sprintf('No handler for message "%s".', context.class));
            }

            this._logger.info('No handler for message {class}', context);
        }

        if (0 < exceptions.length) {
            throw new HandlerFailedException(envelope, exceptions);
        }

        return stack.next().handle(envelope, stack);
    }

    /**
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     * @param {Jymfony.Component.Messenger.Handler.HandlerDescriptor} handlerDescriptor
     *
     * @returns {boolean}
     *
     * @private
     */
    _messageHasAlreadyBeenHandled(envelope, handlerDescriptor) {
        for (const stamp of envelope.all(HandledStamp)) {
            if (stamp.handlerName === handlerDescriptor.name) {
                return true;
            }
        }

        return false;
    }


    /**
     * @param {function(*, Jymfony.Component.Messenger.Handler.Acknowledger?): Promise<void>} handler
     * @param {object} message
     * @param {Jymfony.Component.Messenger.Handler.Acknowledger | null} ack
     * @param {Jymfony.Component.Messenger.Stamp.HandlerArgumentsStamp | null} handlerArgumentsStamp
     *
     * @returns {Promise<*>}
     */
    async _callHandler(handler, message, ack, handlerArgumentsStamp) {
        const args = [ message ];
        if (null !== ack) {
            args.push(ack);
        }
        if (null !== handlerArgumentsStamp) {
            args.push(...handlerArgumentsStamp.additionalArguments);
        }

        return await handler(...args);
    }
}
