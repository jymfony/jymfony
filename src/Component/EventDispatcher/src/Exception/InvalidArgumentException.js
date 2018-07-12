const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Component.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.EventDispatcher.Exception
 */
class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
}

module.exports = InvalidArgumentException;
