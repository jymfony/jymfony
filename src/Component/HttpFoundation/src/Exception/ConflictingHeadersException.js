const RequestExceptionInterface = Jymfony.Component.HttpFoundation.Exception.RequestExceptionInterface;

/**
 * The HTTP request contains headers with conflicting information.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Exception
 */
class ConflictingHeadersException extends mix(UnexpectedValueException, RequestExceptionInterface) {
}

module.exports = ConflictingHeadersException;
