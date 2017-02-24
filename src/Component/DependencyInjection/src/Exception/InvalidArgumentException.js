const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Component.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
module.exports = class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
};
