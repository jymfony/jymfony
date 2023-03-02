declare namespace Jymfony.Component.Messenger.Exception {
    /**
     * A concrete implementation of UnrecoverableExceptionInterface that can be used directly.
     */
    export class UnrecoverableMessageHandlingException extends mix(RuntimeException, UnrecoverableExceptionInterface) {
    }
}
