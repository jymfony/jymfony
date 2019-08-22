const ExceptionInterface = Jymfony.Component.OptionsResolver.Exception.ExceptionInterface;

/**
 * Thrown when two lazy options have a cyclic dependency.
 *
 * @memberOf Jymfony.Component.OptionsResolver.Exception
 */
export default class OptionDefinitionException extends mix(LogicException, ExceptionInterface) {
}
