const BaseException = global.BadMethodCallException;
const ExceptionInterface = Jymfony.Component.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
module.exports = class BadMethodCallException extends mix(BaseException, ExceptionInterface) {
};
