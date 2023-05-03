declare namespace Jymfony.Component.Filesystem.Exception {
    /**
     * Thrown when an unsupported operation has been called on a
     * stream wrapper (ex: readdir on http).
     */
    export class UnsupportedOperationException extends mix(global.RuntimeException, ExceptionInterface) {
    }
}
