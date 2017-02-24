const BaseException = global.LogicException;
const ExceptionInterface = Jymfony.Component.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
module.exports = class LogicException extends mix(BaseException, ExceptionInterface) {
};
