const BaseException = globalThis.InvalidArgumentException;
const ExceptionInterface = Jymfony.Component.OptionsResolver.Exception.ExceptionInterface;

/**
 * Thrown when an argument is invalid.
 *
 * @memberOf Jymfony.Component.OptionsResolver.Exception
 */
export default class InvalidArgumentException extends mix(BaseException, ExceptionInterface) {
}
