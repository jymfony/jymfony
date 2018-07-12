const ExceptionInterface = Jymfony.Component.EventDispatcher.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.EventDispatcher.Exception
 */
class NotStaticMethodException extends mix(Exception, ExceptionInterface) {
}

module.exports = NotStaticMethodException;
