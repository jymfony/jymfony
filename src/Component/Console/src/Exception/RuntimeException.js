const BaseException = global.RuntimeException;
const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Console.Exception
 * @type RuntimeException
 */
module.exports = class RuntimeException extends mix(BaseException, ExceptionInterface) {
};
