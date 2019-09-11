const InvalidArgumentException = Jymfony.Component.OptionsResolver.Exception.InvalidArgumentException;

/**
 * Exception thrown when an undefined option is passed.
 *
 * You should remove the options in question from your code or define them
 * beforehand.
 *
 * @memberOf Jymfony.Component.OptionsResolver.Exception
 */
export default class UndefinedOptionsException extends InvalidArgumentException {
}
