declare namespace Jymfony.Component.OptionsResolver.Exception {
    /**
     * Thrown when the value of an option does not match its validation rules.
     *
     * You should make sure a valid value is passed to the option.
     */
    export class InvalidOptionsException extends InvalidArgumentException {
    }
}
