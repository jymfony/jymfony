declare namespace Jymfony.Component.OptionsResolver.Exception {
    /**
     * Exception thrown when an undefined option is passed.
     *
     * You should remove the options in question from your code or define them
     * beforehand.
     */
    export class UndefinedOptionsException extends InvalidArgumentException {
    }
}
