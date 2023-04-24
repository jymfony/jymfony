declare namespace Jymfony.Component.Messenger.Handler {
    /**
     * Describes a handler and the possible associated options, such as `from_transport`, `bus`, etc.
     *
     * @final
     */
    export class HandlerDescriptor {
        private _handler: (message: any, ack?: Acknowledger) => Promise<void>;
        private _batchHandler: BatchHandlerInterface | null;
        private _options: Record<string, any>;
        private _name: string;

        /**
         * Constructor.
         *
         * @param {function(*, Jymfony.Component.Messenger.Handler.Acknowledger?): Promise<void>} handler
         * @param {*} [options = {}]
         */
        __construct(handler: (message: any, ack?: Acknowledger) => Promise<void>, options?: Record<string, any>): void;
        constructor(handler: (message: any, ack?: Acknowledger) => Promise<void>, options?: Record<string, any>);

        public readonly handler: (message: any, ack?: Acknowledger) => Promise<void>;

        public readonly name: string;

        public readonly batchHandler: BatchHandlerInterface | null;

        getOption(option: string): any;
    }
}
