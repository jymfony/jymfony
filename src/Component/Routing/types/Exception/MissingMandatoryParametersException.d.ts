declare namespace Jymfony.Component.Routing.Exception {
    /**
     * Exception thrown when a mandatory parameter is missing during url generation.
     */
    export class MissingMandatoryParametersException extends mix(global.InvalidArgumentException, ExceptionInterface) {
    }
}
