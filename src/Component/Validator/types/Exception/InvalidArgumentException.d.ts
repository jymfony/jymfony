declare namespace Jymfony.Component.Validator.Exception {
    import ExceptionInterface = Jymfony.Component.Validator.Exception.ExceptionInterface;

    /**
     * Base InvalidArgumentException for the Validator component.
     *
     * @memberOf Jymfony.Component.Validator.Exception
     */
    export class InvalidArgumentException extends mix(global.InvalidArgumentException, ExceptionInterface) {
    }
}
