declare namespace Jymfony.Component.Validator.Mapping {
    import Constraint = Jymfony.Component.Validator.Constraint;
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

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
     */
    export class PropertyMetadataInterface extends MetadataInterface.definition {
        /**
         * Returns the name of the property.
         *
         * @returns The property name
         */
        public readonly propertyName: string;

        /**
         * Extracts the value of the property from the given container.
         *
         * @param containingValue The container to extract the property value from
         *
         * @returns The value of the property
         */
        getPropertyValue(containingValue: any): any;

        /**
         * Gets the declaring class name.
         */
        public readonly className: string;

        /**
         * Returns all constraints for a given validation group.
         *
         * @param group The validation group
         *
         * @returns A list of Constraint instances
         */
        findConstraints(group: string): Constraint[];
    }
}
