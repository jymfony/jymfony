const BaseException = global.BadMethodCallException;
const ExceptionInterface = Jymfony.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.DependencyInjection.Exception
 */
module.exports = class BadMethodCallException extends mix(BaseException, ExceptionInterface) {
};
