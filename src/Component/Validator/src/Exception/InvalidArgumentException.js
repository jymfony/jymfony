const ExceptionInterface = Jymfony.Component.Validator.Exception.ExceptionInterface;

/**
 * Base InvalidArgumentException for the Validator component.
 *
 * @memberOf Jymfony.Component.Validator.Exception
 */
export default class InvalidArgumentException extends mix(globalThis.InvalidArgumentException, ExceptionInterface) {
}
