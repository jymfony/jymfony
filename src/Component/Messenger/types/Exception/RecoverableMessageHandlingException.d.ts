declare namespace Jymfony.Component.Messenger.Exception {
    /**
     * A concrete implementation of RecoverableExceptionInterface that can be used directly.
     */
    export class RecoverableMessageHandlingException extends mix(RuntimeException, RecoverableExceptionInterface) {
    }
}
