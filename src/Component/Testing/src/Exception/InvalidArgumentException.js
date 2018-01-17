const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Component.Testing.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Testing.Exception
 */
class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
}

module.exports = InvalidArgumentException;
