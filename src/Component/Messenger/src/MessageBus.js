const StackMiddleware = Jymfony.Component.Messenger.Middleware.StackMiddleware;
const Envelope = Jymfony.Component.Messenger.Envelope;
const MessageBusInterface = Jymfony.Component.Messenger.MessageBusInterface;

/**
 * @memberOf Jymfony.Component.Messenger
 */
export default class MessageBus extends implementationOf(MessageBusInterface) {
    /**
     * Constructor
     *
     * @param {Jymfony.Component.Messenger.Middleware.MiddlewareInterface[]} middlewareHandlers
     */
    __construct(middlewareHandlers = []) {
        /**
         * @type {Jymfony.Component.Messenger.Middleware.MiddlewareInterface[]}
         *
         * @private
         */
        this._middlewareHandlers = [ ...middlewareHandlers ];
    }

    /**
     * @inheritdoc
     */
    async dispatch(message, stamps = []) {
        const envelope = Envelope.wrap(message, stamps);
        if (0 === this._middlewareHandlers.length) {
            return envelope;
        }

        const stack = new StackMiddleware(this._middlewareHandlers);

        return await stack.next().handle(envelope, stack);
    }
}
