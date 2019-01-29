const ArgumentInterface = Jymfony.Component.DependencyInjection.Argument.ArgumentInterface;
const ReferenceSetArgumentTrait = Jymfony.Component.DependencyInjection.Argument.ReferenceSetArgumentTrait;

/**
 * Represents a closure acting as a service locator.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Argument
 */
class ServiceLocatorArgument extends implementationOf(ArgumentInterface, ReferenceSetArgumentTrait) {
    /**
     * Constructor.
     *
     * @param {Array} values
     */
    __construct(values) {
        this._values = values;
    }
}

module.exports = ServiceLocatorArgument;
