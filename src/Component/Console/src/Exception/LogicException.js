const BaseException = global.LogicException;
const ExceptionInterface = Jymfony.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Console.Exception
 * @type LogicException
 */
module.exports = class LogicException extends mix(BaseException, ExceptionInterface) {
};
