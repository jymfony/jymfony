declare namespace Jymfony.Component.Messenger.Stamp {
    import HandlerDescriptor = Jymfony.Component.Messenger.Handler.HandlerDescriptor;

    /**
     * Stamp identifying a message handled by the `HandleMessageMiddleware` middleware
     * and storing the handler returned value.
     *
     * This is used by synchronous command buses expecting a return value and the retry logic
     * to only execute handlers that didn't succeed.
     *
     * @see Jymfony.Component.Messenger.Middleware.HandleMessageMiddleware
     * @see Jymfony.Component.Messenger.HandleTrait
     *
     * @memberOf Jymfony.Component.Messenger.Stamp
     */
    export class HandledStamp extends implementationOf(StampInterface) {
        private _result: any;
        private _handlerName: string;

        /**
         * Constructor.
         */
        __construct(result: any, handlerName: string): void;
        constructor(result: any, handlerName: string);

        /**
         * @param {Jymfony.Component.Messenger.Handler.HandlerDescriptor} handler
         * @param {*} result
         *
         * @returns {Jymfony.Component.Messenger.Stamp.HandledStamp}
         */
        static fromDescriptor(handler: HandlerDescriptor, result: any): HandledStamp;

        public readonly result: any;

        public readonly handlerName: string;
    }
}
