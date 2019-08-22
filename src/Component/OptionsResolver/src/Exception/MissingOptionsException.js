const InvalidArgumentException = Jymfony.Component.OptionsResolver.Exception.InvalidArgumentException;

/**
 * Exception thrown when a required option is missing.
 *
 * Add the option to the passed options array.
 *
 * @memberOf Jymfony.Component.OptionsResolver.Exception
 */
export default class MissingOptionsException extends InvalidArgumentException {
}
