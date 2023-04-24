declare namespace Jymfony.Component.Messenger.Exception {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    export class HandlerFailedException extends RuntimeException {
        private _envelope: Envelope;
        private _exceptions: Error[];

        // @ts-ignore
        __construct(envelope: Envelope, exceptions: Error[]): void;
        constructor(envelope: Envelope, exceptions: Error[]);

        public readonly envelope: Envelope;

        public readonly nestedExceptions: Error[];

        getNestedExceptionOfClass(exceptionClassName: string): Error[];
        getNestedExceptionOfClass<T extends Error>(exceptionClassName: Newable<T>): T[];
        getNestedExceptionOfClass(exceptionClassName: string | Newable): Error[];
    }
}
