const RuntimeException = Jymfony.Component.Messenger.Exception.RuntimeException;
const RecoverableExceptionInterface = Jymfony.Component.Messenger.Exception.RecoverableExceptionInterface;

/**
 * A concrete implementation of RecoverableExceptionInterface that can be used directly.
 *
 * @memberOf Jymfony.Component.Messenger.Exception
 */
export default class RecoverableMessageHandlingException extends mix(RuntimeException, RecoverableExceptionInterface) {
}
