const ArgumentInterface = Jymfony.Component.DependencyInjection.Argument.ArgumentInterface;
const TaggedIteratorArgument = Jymfony.Component.DependencyInjection.Argument.TaggedIteratorArgument;
const ReferenceSetArgumentTrait = Jymfony.Component.DependencyInjection.Argument.ReferenceSetArgumentTrait;

/**
 * Represents a closure acting as a service locator.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Argument
 */
export default class ServiceLocatorArgument extends implementationOf(ArgumentInterface, ReferenceSetArgumentTrait) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.TaggedIteratorArgument|Jymfony.Component.DependencyInjection.Reference[]} values
     */
    __construct(values) {
        if (values instanceof TaggedIteratorArgument) {
            /**
             * @type {Jymfony.Component.DependencyInjection.TaggedIteratorArgument}
             *
             * @private
             */
            this._taggedIteratorArgument = values;
            values = [];
        }

        this._values = values;
    }

    /**
     * Gets the tagged iterator for this service locator.
     *
     * @returns {Jymfony.Component.DependencyInjection.TaggedIteratorArgument}
     */
    get taggedIteratorArgument() {
        return this._taggedIteratorArgument;
    }
}
