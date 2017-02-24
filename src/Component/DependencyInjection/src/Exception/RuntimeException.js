const BaseException = global.RuntimeException;
const ExceptionInterface = Jymfony.Component.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
module.exports = class RuntimeException extends mix(BaseException, ExceptionInterface) {
};
