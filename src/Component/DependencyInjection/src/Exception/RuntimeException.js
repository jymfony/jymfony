const BaseException = global.RuntimeException;
const ExceptionInterface = Jymfony.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.DependencyInjection.Exception
 */
module.exports = class RuntimeException extends mix(BaseException, ExceptionInterface) {
};
