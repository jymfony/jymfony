const ExceptionInterface = Jymfony.Component.Messenger.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Exception
 */
export default class LogicException extends mix(global.LogicException, ExceptionInterface) {
}
