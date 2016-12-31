const BaseException = global.RuntimeException;
const ExceptionInterface = Jymfony.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Console.Exception
 * @type RuntimeException
 */
module.exports = class RuntimeException extends mix(BaseException, ExceptionInterface) {
};
