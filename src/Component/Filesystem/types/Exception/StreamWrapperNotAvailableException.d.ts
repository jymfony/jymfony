declare namespace Jymfony.Component.Filesystem.Exception {
    /**
     * Thrown when a non-registered protocol has been requested
     * to the stream wrapper registry.
     */
    export class StreamWrapperNotAvailableException extends mix(RuntimeException, ExceptionInterface) {
        // @ts-ignore
        __construct(protocol: string, previous?: Error): void;
        constructor(protocol: string, previous?: Error);
    }
}
