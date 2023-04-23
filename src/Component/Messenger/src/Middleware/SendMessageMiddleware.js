const LoggerAwareTrait = Jymfony.Contracts.Logger.LoggerAwareTrait;
const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;
const NoSenderForMessageException = Jymfony.Component.Messenger.Exception.NoSenderForMessageException;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;
const ReceivedStamp = Jymfony.Component.Messenger.Stamp.ReceivedStamp;
const SendMessageToTransportsEvent = Jymfony.Component.Messenger.Event.SendMessageToTransportsEvent;
const SentStamp = Jymfony.Component.Messenger.Stamp.SentStamp;

/**
 * @memberOf Jymfony.Component.Messenger.Middleware
 */
export default class SendMessageMiddleware extends implementationOf(MiddlewareInterface, LoggerAwareTrait) {
    /**
     * @param {Jymfony.Component.Messenger.Transport.Sender.SendersLocatorInterface} sendersLocator
     * @param {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface} [eventDispatcher = null]
     * @param {boolean} [allowNoSenders = true]
     */
    __construct(sendersLocator, eventDispatcher = null, allowNoSenders = true) {
        /**
         * @type {Jymfony.Component.Messenger.Transport.Sender.SendersLocatorInterface}
         *
         * @private
         */
        this._sendersLocator = sendersLocator;

        /**
         * @type {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface}
         *
         * @private
         */
        this._eventDispatcher = eventDispatcher;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._allowNoSenders = allowNoSenders;

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = new NullLogger();
    }

    /**
     * @inheritdoc
     */
    async handle(envelope, stack) {
        const context = {
            class: ReflectionClass.getClassName(envelope.message),
        };

        let sender = null;
        let alias = null;

        if (0 < envelope.all(ReceivedStamp).length) {
            // It's a received message, do not send it back
            this._logger.info('Received message {class}', context);
        } else {
            let shouldDispatchEvent = true;
            for ([ alias, sender ] of __jymfony.getEntries(this._sendersLocator.getSenders(envelope))) {
                sender = await sender;
                if (null !== this._eventDispatcher && shouldDispatchEvent) {
                    const event = new SendMessageToTransportsEvent(envelope);
                    await this._eventDispatcher.dispatch(event);
                    envelope = event.envelope;
                    shouldDispatchEvent = false;
                }

                this._logger.info('Sending message {class} with {alias} sender using {sender}', { ...context, alias, sender: ReflectionClass.getClassName(sender) });
                envelope = await sender.send(envelope.withStamps(new SentStamp(ReflectionClass.getClassName(sender), isString(alias) ? alias : null)));
            }

            if (! this._allowNoSenders && ! sender) {
                throw new NoSenderForMessageException(__jymfony.sprintf('No sender for message "%s".', context.class));
            }
        }

        if (null === sender) {
            return stack.next().handle(envelope, stack);
        }

        // Message should only be sent and not be handled by the next middleware
        return envelope;
    }
}
