const BaseException = global.LogicException;
const ExceptionInterface = Jymfony.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.DependencyInjection.Exception
 */
module.exports = class LogicException extends mix(BaseException, ExceptionInterface) {
};
