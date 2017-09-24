const InvalidArgumentException = Jymfony.Component.OptionsResolver.Exception.InvalidArgumentException;

/**
 * Thrown when the value of an option does not match its validation rules.
 *
 * You should make sure a valid value is passed to the option.
 *
 * @memberOf Jymfony.Component.OptionsResolver.Exception
 */
class InvalidOptionsException extends InvalidArgumentException {
}

module.exports = InvalidOptionsException;
