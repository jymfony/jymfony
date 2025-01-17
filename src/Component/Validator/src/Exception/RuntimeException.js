const ExceptionInterface = Jymfony.Component.Validator.Exception.ExceptionInterface;

/**
 * Base RuntimeException for the Validator component.
 *
 * @memberOf Jymfony.Component.Validator.Exception
 */
export default class RuntimeException extends mix(globalThis.RuntimeException, ExceptionInterface) {
}
