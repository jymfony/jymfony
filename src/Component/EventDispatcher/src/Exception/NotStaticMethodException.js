const ExceptionInterface = Jymfony.Component.EventDispatcher.Exception.ExceptionInterface;

class NotStaticMethodException extends mix(Exception, ExceptionInterface) {

}

module.exports = NotStaticMethodException;
