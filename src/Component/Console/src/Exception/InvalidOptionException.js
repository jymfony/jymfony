const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Console.Exception
 * @type InvalidOptionException
 */
module.exports = class InvalidOptionException extends mix(BaseException, ExceptionInterface) {
};
