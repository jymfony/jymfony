const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Console.Exception
 * @type InvalidOptionException
 */
module.exports = class InvalidOptionException extends mix(BaseException, ExceptionInterface) {
};
