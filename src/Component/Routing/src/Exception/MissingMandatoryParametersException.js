const ExceptionInterface = Jymfony.Component.Routing.Exception.ExceptionInterface;

/**
 * Exception thrown when a mandatory parameter is missing during url generation.
 *
 * @memberOf Jymfony.Component.Routing.Exception
 */
class MissingMandatoryParametersException extends mix(InvalidArgumentException, ExceptionInterface) {
}

module.exports = MissingMandatoryParametersException;
