const BaseException = global.LogicException;
const ExceptionInterface = Jymfony.Component.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
class LogicException extends mix(BaseException, ExceptionInterface) {
}

module.exports = LogicException;
