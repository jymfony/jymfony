const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Console.Exception
 * @type InvalidArgumentException
 */
module.exports = class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
};
