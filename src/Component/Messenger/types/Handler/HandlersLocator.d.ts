declare namespace Jymfony.Component.Messenger.Handler {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    type Handlers = Record<string, (HandlerDescriptor | ((msg: any) => Promise<any>))[]>;

    /**
     * Maps a message to a list of handlers.
     *
     * @memberOf Jymfony.Component.Messenger.Handler
     */
    export class HandlersLocator extends implementationOf(HandlersLocatorInterface) {
        private _handlers: Handlers

        __construct(handlers: Handlers): void;
        constructor(handlers: Handlers);

        /**
         * @inheritdoc
         */
        getHandlers(envelope: Envelope): Generator<HandlerDescriptor>;

        /**
         * @internal
         */
        static listTypes(envelope: Envelope): string[];

        private _shouldHandle(envelope: Envelope, handlerDescriptor: HandlerDescriptor): boolean;
    }
}
