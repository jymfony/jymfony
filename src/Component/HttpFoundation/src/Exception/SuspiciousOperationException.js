const RequestExceptionInterface = Jymfony.Component.HttpFoundation.Exception.RequestExceptionInterface;

/**
 * Raised when a user has performed an operation that should be considered
 * suspicious from a security perspective.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Exception
 */
export default class SuspiciousOperationException extends mix(UnexpectedValueException, RequestExceptionInterface) {
}
