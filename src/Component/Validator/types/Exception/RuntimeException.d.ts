declare namespace Jymfony.Component.Validator.Exception {
    import ExceptionInterface = Jymfony.Component.Validator.Exception.ExceptionInterface;

    /**
     * Base RuntimeException for the Validator component.
     */
    export class RuntimeException extends mix(global.RuntimeException, ExceptionInterface) {
    }
}
