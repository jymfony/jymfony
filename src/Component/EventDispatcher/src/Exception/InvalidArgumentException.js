const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Component.DependencyInjection.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.EventDispatcher.Exception
 */
module.exports = class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
};
