declare namespace Jymfony.Component.Validator.Mapping {
    import BaseClassMetadataInterface = Jymfony.Component.Metadata.ClassMetadataInterface;
    import GroupSequence = Jymfony.Component.Validator.Constraints.GroupSequence;

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
     */
    class ClassMetadataInterface extends BaseClassMetadataInterface {
        public static readonly definition: Newable<ClassMetadataInterface>;

        /**
         * Returns the names of all constrained properties.
         */
        public readonly constrainedProperties: string[];

        /**
         * Returns whether the "Default" group is overridden by a group sequence.
         *
         * If it is, you can access the group sequence with {@link groupSequence}.
         *
         * @returns Returns true if the "Default" group is overridden
         *
         * @see Jymfony.Component.Validator.Constraints.GroupSequence
         */
        hasGroupSequence(): boolean;

        /**
         * Returns the group sequence that overrides the "Default" group for this
         * class.
         *
         * @see Jymfony.Component.Validator.Constraints.GroupSequence
         */
        public readonly groupSequence: GroupSequence | null;

        /**
         * Returns whether the "Default" group is overridden by a dynamic group
         * sequence obtained by the validated objects.
         *
         * If this method returns true, the class must implement
         * {@link Jymfony.Component.Validator.GroupSequenceProviderInterface}.
         * This interface will be used to obtain the group sequence when an object
         * of this class is validated.
         *
         * @returns Returns true if the "Default" group is overridden by a dynamic group sequence
         *
         * @see Jymfony.Component.Validator.GroupSequenceProviderInterface
         */
        isGroupSequenceProvider(): boolean;

        /**
         * Returns the name of the backing class.
         */
        public readonly className: string;
    }
}
