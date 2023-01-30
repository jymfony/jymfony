const ExceptionInterface = Jymfony.Component.Messenger.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Exception
 */
class LogicException extends mix(global.LogicException, ExceptionInterface) {
}
