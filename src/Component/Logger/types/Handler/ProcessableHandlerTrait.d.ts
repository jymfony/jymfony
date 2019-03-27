declare namespace Jymfony.Component.Logger.Handler {
    export class ProcessableHandlerTrait implements MixinInterface {
        public static readonly definition: Newable<ProcessableHandlerTrait>;
        private _processors: Invokable<any>[];

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Push a processor at the top of the stack.
         */
        pushProcessor(processor: InvokableProcessor): this;

        /**
         * Pop the first processor of the stack.
         */
        popProcessor(): InvokableProcessor;

        /**
         * Processes a record.
         */
        protected _processRecord(record: LogRecord): LogRecord;
    }
}
