declare namespace Jymfony.Component.OptionsResolver.Exception {
    /**
     * Thrown when trying to read an option outside of or write it inside of
     * Options::resolve()
     */
    export class AccessException extends mix(LogicException, ExceptionInterface) {
    }
}
