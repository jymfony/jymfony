const RequestExceptionInterface = Jymfony.Component.HttpFoundation.Exception.RequestExceptionInterface;

/**
 * The HTTP request contains headers with conflicting information.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Exception
 */
export default class ConflictingHeadersException extends mix(UnexpectedValueException, RequestExceptionInterface) {
}
