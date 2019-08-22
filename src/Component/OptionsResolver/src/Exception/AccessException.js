const ExceptionInterface = Jymfony.Component.OptionsResolver.Exception.ExceptionInterface;

/**
 * Thrown when trying to read an option outside of or write it inside of
 * Options::resolve()
 *
 * @memberOf Jymfony.Component.OptionsResolver.Exception
 */
export default class AccessException extends mix(LogicException, ExceptionInterface) {
}
