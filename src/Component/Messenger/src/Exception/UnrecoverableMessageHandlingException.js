const RuntimeException = Jymfony.Component.Messenger.Exception.RuntimeException;
const UnrecoverableExceptionInterface = Jymfony.Component.Messenger.Exception.UnrecoverableExceptionInterface;

/**
 * A concrete implementation of UnrecoverableExceptionInterface that can be used directly.
 *
 * @memberOf Jymfony.Component.Messenger.Exception
 */
export default class UnrecoverableMessageHandlingException extends mix(RuntimeException, UnrecoverableExceptionInterface) {
}
