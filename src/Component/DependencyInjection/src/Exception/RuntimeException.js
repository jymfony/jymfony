const BaseException = global.RuntimeException;
const ExceptionInterface = Jymfony.Component.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
class RuntimeException extends mix(BaseException, ExceptionInterface) {
}

module.exports = RuntimeException;
