const BaseException = global.BadMethodCallException;
const ExceptionInterface = Jymfony.Component.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
class BadMethodCallException extends mix(BaseException, ExceptionInterface) {
}

module.exports = BadMethodCallException;
