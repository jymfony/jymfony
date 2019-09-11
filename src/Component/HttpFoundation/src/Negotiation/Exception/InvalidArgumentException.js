const ExceptionInterface = Jymfony.Component.HttpFoundation.Negotiation.Exception.ExceptionInterface;

/**
 * Thrown when an invalid argument is passed.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation.Exception
 */
export default class InvalidArgumentException extends mix(global.InvalidArgumentException, ExceptionInterface) {
}
