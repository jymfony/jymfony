const BaseException = global.LogicException;
const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Console.Exception
 * @type LogicException
 */
module.exports = class LogicException extends mix(BaseException, ExceptionInterface) {
};
