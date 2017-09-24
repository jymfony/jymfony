const InvalidArgumentException = Jymfony.Component.OptionsResolver.Exception.InvalidArgumentException;

/**
 * Exception thrown when an undefined option is passed.
 *
 * You should remove the options in question from your code or define them
 * beforehand.
 *
 * @memberOf Jymfony.Component.OptionsResolver.Exception
 */
class UndefinedOptionsException extends InvalidArgumentException {
}

module.exports = UndefinedOptionsException;
