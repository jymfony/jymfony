const ArgumentInterface = Jymfony.Component.DependencyInjection.Argument.ArgumentInterface;
const ReferenceSetArgumentTrait = Jymfony.Component.DependencyInjection.Argument.ReferenceSetArgumentTrait;

/**
 * Represents a collection of values to lazily iterate over.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Argument
 */
class IteratorArgument extends implementationOf(ArgumentInterface, ReferenceSetArgumentTrait) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.Reference[]} values
     */
    __construct(values) {
        this._values = values;
    }
}

module.exports = IteratorArgument;
