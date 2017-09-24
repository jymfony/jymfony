const ExceptionInterface = Jymfony.Component.OptionsResolver.Exception.ExceptionInterface;

/**
 * Thrown when two lazy options have a cyclic dependency.
 *
 * @memberOf Jymfony.Component.OptionsResolver.Exception
 */
class OptionDefinitionException extends mix(LogicException, ExceptionInterface) {
}

module.exports = OptionDefinitionException;
