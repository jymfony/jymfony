const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Component.OptionsResolver.Exception.ExceptionInterface;

/**
 * Thrown when an argument is invalid.
 *
 * @memberOf Jymfony.Component.OptionsResolver.Exception
 */
class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
}

module.exports = InvalidArgumentException;
