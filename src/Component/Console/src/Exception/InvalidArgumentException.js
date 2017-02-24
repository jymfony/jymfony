const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Console.Exception
 * @type InvalidArgumentException
 */
module.exports = class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
};
