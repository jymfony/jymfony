const ExceptionInterface = Jymfony.Component.OptionsResolver.Exception.ExceptionInterface;

/**
 * Thrown when trying to read an option that has no value set.
 *
 * When accessing optional options from within a lazy option or normalizer you should first
 * check whether the optional option is set. You can do this with `options.has('optional')`.
 * In contrast to the {@link UndefinedOptionsException}, this is a runtime exception that can
 * occur when evaluating lazy options.
 *
 * @memberOf Jymfony.Component.OptionsResolver.Exception
 */
export default class NoSuchOptionException extends mix(OutOfBoundsException, ExceptionInterface) {
}
