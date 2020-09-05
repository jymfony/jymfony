const MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

/**
 * Stores all metadata needed for validating the value of a class property.
 *
 * Most importantly, the metadata stores the constraints against which the
 * property's value should be validated.
 *
 * Additionally, the metadata stores whether objects stored in the property
 * should be validated against their class' metadata and whether traversable
 * objects should be traversed or not.
 *
 * @see Jymfony.Contracts.Metadata.MetadataInterface
 * @see Jymfony.Component.Metadata.ClassMetadataInterface
 * @see Jymfony.Component.Validator.Mapping.CascadingStrategy
 * @see Jymfony.Component.Validator.Mapping.TraversalStrategy
 *
 * @memberOf Jymfony.Component.Validator.Mapping
 */
class PropertyMetadataInterface extends MetadataInterface.definition {
    /**
     * Returns the name of the property.
     *
     * @returns {string} The property name
     */
    get propertyName() { }

    /**
     * Extracts the value of the property from the given container.
     *
     * @param {*} containingValue The container to extract the property value from
     *
     * @returns {*} The value of the property
     */
    getPropertyValue(containingValue) { }

    /**
     * Gets the declaring class name.
     *
     * @returns {string}
     */
    get className() { }

    /**
     * Returns all constraints for a given validation group.
     *
     * @param {string} group The validation group
     *
     * @returns {Jymfony.Component.Validator.Constraint[]} A list of Constraint instances
     */
    findConstraints(group) { }
}

export default getInterface(PropertyMetadataInterface);
