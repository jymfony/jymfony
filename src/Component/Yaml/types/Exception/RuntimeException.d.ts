declare namespace Jymfony.Component.Yaml.Exception {
    import BaseException = NodeJS.Global.RuntimeException;

    /**
     * Exception class thrown when an error occurs during parsing.
     */
    export class RuntimeException extends mix(BaseException, ExceptionInterface) {
    }
}
