const ExceptionInterface = Jymfony.Component.HttpFoundation.Negotiation.Exception.ExceptionInterface;

/**
 * Thrown when an invalid argument is passed.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation.Exception
 */
class InvalidArgumentException extends mix(global.InvalidArgumentException, ExceptionInterface) {
}

module.exports = InvalidArgumentException;
