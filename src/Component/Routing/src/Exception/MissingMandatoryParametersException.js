const ExceptionInterface = Jymfony.Component.Routing.Exception.ExceptionInterface;

/**
 * Exception thrown when a mandatory parameter is missing during url generation.
 *
 * @memberOf Jymfony.Component.Routing.Exception
 */
export default class MissingMandatoryParametersException extends mix(InvalidArgumentException, ExceptionInterface) {
}
