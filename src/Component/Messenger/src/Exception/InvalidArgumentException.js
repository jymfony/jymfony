const ExceptionInterface = Jymfony.Component.Messenger.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Exception
 */
export default class InvalidArgumentException extends mix(globalThis.InvalidArgumentException, ExceptionInterface) {
}
