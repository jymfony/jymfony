const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Console.Exception
 */
class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
}

module.exports = InvalidArgumentException;
