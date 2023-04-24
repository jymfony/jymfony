declare namespace Jymfony.Component.Messenger.Exception {
    export class StopWorkerException extends mix(RuntimeException, StopWorkerExceptionInterface) {
        /**
         * Constructor.
         *
         * @param [message = 'Worker should stop.']
         * @param [previous = null]
         */
        // @ts-ignore
        __construct(message?: string, previous?: Error | null): void;
        constructor(message?: string, previous?: Error | null);
    }
}
