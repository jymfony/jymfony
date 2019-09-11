const ExceptionInterface = Jymfony.Component.EventDispatcher.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.EventDispatcher.Exception
 */
export default class NotStaticMethodException extends mix(Exception, ExceptionInterface) {
}
