declare namespace Jymfony.Component.OptionsResolver.Exception {
    /**
     * Thrown when two lazy options have a cyclic dependency.
     */
    export class OptionDefinitionException extends mix(LogicException, ExceptionInterface) {
    }
}
