const BaseClassMetadataInterface = Jymfony.Component.Metadata.ClassMetadataInterface;

/**
 * Stores all metadata needed for validating objects of specific class.
 *
 * Most importantly, the metadata stores the constraints against which an object
 * and its properties should be validated.
 *
 * Additionally, the metadata stores whether the "Default" group is overridden
 * by a group sequence for that class and whether instances of that class
 * should be traversed or not.
 *
 * @see Jymfony.Contracts.Metadata.MetadataInterface
 * @see Jymfony.Component.Metadata.ClassMetadataInterface
 * @see Jymfony.Component.Validator.Constraints.GroupSequence
 * @see Jymfony.Component.Validator.GroupSequenceProviderInterface
 * @see Jymfony.Component.Validator.Mapping.TraversalStrategy
 *
 * @memberOf Jymfony.Component.Validator.Mapping
 */
class ClassMetadataInterface extends BaseClassMetadataInterface.definition {
    /**
     * Returns the strategy for cascading objects.
     *
     * @returns {int} The cascading strategy
     *
     * @see CascadingStrategy
     */
    get cascadingStrategy() { }

    /**
     * Returns the strategy for traversing traversable objects.
     *
     * @returns {int} The traversal strategy
     *
     * @see TraversalStrategy
     */
    get traversalStrategy() { }

    /**
     * Returns all constraints of this element.
     *
     * @returns {Jymfony.Component.Validator.Constraint[]} A list of Constraint instances
     */
    get constraints() { }

    /**
     * Returns all constraints for a given validation group.
     *
     * @param {string} group The validation group
     *
     * @returns {Jymfony.Component.Validator.Constraint[]} A list of Constraint instances
     */
    findConstraints(group) { }

    /**
     * Returns the names of all constrained properties.
     *
     * @returns {string[]} A list of property names
     */
    get constrainedProperties() { }

    /**
     * Returns whether the "Default" group is overridden by a group sequence.
     *
     * If it is, you can access the group sequence with {@link groupSequence}.
     *
     * @returns {boolean} Returns true if the "Default" group is overridden
     *
     * @see Jymfony.Component.Validator.Constraints.GroupSequence
     */
    hasGroupSequence() { }

    /**
     * Returns the group sequence that overrides the "Default" group for this
     * class.
     *
     * @returns {Jymfony.Component.Validator.Constraints.GroupSequence|null} The group sequence or null
     *
     * @see Jymfony.Component.Validator.Constraints.GroupSequence
     */
    get groupSequence() { }

    /**
     * Returns whether the "Default" group is overridden by a dynamic group
     * sequence obtained by the validated objects.
     *
     * If this method returns true, the class must implement
     * {@link Jymfony.Component.Validator.GroupSequenceProviderInterface}.
     * This interface will be used to obtain the group sequence when an object
     * of this class is validated.
     *
     * @returns {boolean} Returns true if the "Default" group is overridden by
     *                    a dynamic group sequence
     *
     * @see Jymfony.Component.Validator.GroupSequenceProviderInterface
     */
    isGroupSequenceProvider() { }

    /**
     * Returns the name of the backing class.
     *
     * @returns {string} The name of the backing class
     */
    get className() { }
}

export default getInterface(ClassMetadataInterface);
