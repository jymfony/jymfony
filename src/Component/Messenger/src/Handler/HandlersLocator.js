const HandlerDescriptor = Jymfony.Component.Messenger.Handler.HandlerDescriptor;
const HandlersLocatorInterface = Jymfony.Component.Messenger.Handler.HandlersLocatorInterface;
const ReceivedStamp = Jymfony.Component.Messenger.Stamp.ReceivedStamp;

/**
 * Maps a message to a list of handlers.
 *
 * @memberOf Jymfony.Component.Messenger.Handler
 */
export default class HandlersLocator extends implementationOf(HandlersLocatorInterface) {
    /**
     * @param {Jymfony.Component.Messenger.Handler.HandlerDescriptor[][]|(function(*): Promise<*>[][])} handlers
     */
    __construct(handlers) {
        /**
         * @type {Jymfony.Component.Messenger.Handler.HandlerDescriptor[][]|(function(*): Promise<*>[][])}
         *
         * @private
         */
        this._handlers = handlers;
    }

    /**
     * @inheritdoc
     */
    * getHandlers(envelope) {
        const seen = [];

        for (const type of __self.listTypes(envelope)) {
            for (let handlerDescriptor of this._handlers[type] || []) {
                if (isFunction(handlerDescriptor)) {
                    handlerDescriptor = new HandlerDescriptor(handlerDescriptor);
                }

                if (! this._shouldHandle(envelope, handlerDescriptor)) {
                    continue;
                }

                const name = handlerDescriptor.name;
                if (seen.includes(name)) {
                    continue;
                }

                seen.push(name);

                yield handlerDescriptor;
            }
        }
    }

    /**
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     *
     * @internal
     */
    static listTypes(envelope) {
        const reflClass = new ReflectionClass(envelope.message);

        const types = [ reflClass.name ];
        let p = reflClass;
        while (p = p.getParentClass()) {
            types.push(reflClass.name);
        }

        for (const i of reflClass.interfaces) {
            types.push(i.name);
        }

        types.push('*');

        return types;
    }

    /**
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     * @param {Jymfony.Component.Messenger.Handler.HandlerDescriptor} handlerDescriptor
     *
     * @returns {boolean}
     *
     * @private
     */
    _shouldHandle(envelope, handlerDescriptor) {
        /** @type {Jymfony.Component.Messenger.Stamp.ReceivedStamp|null} */
        const received = envelope.last(ReceivedStamp);
        if (null === received) {
            return true;
        }

        const expectedTransport = handlerDescriptor.getOption('from_transport');
        if (null === expectedTransport) {
            return true;
        }

        return received.transportName === expectedTransport;
    }
}
