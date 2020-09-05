declare namespace Jymfony.Component.Validator.Mapping {
    import BaseClassMetadata = Jymfony.Component.Metadata.ClassMetadata;
    import ClassMetadataInterface = Jymfony.Component.Validator.Mapping.ClassMetadataInterface;
    import Constraint = Jymfony.Component.Validator.Constraint;
    import GenericMetadataTrait = Jymfony.Component.Validator.Mapping.GenericMetadataTrait;
    import GroupSequence = Jymfony.Component.Validator.Constraints.GroupSequence;
    import NullMetadata = Jymfony.Component.Validator.Mapping.NullMetadata;
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

    /**
     * Default implementation of {@link ClassMetadataInterface}.
     *
     * This class supports serialization and cloning.
     */
    export class ClassMetadata extends mix(BaseClassMetadata, ClassMetadataInterface, GenericMetadataTrait) {
        private _defaultGroup: string;
        private _groupSequence: null | string[];
        private _groupSequenceProvider: boolean;

        /**
         * The strategy for traversing traversable objects.
         * By default, only arrays and object literal are traversed.
         */
        private _traversalStrategy: number;

        /**
         * Constructs a metadata for the given class.
         */
        __construct(reflectionClass: ReflectionClass): void;
        constructor(reflectionClass: ReflectionClass);

        /**
         * @inheritdoc
         */
        __sleep(): string[];

        /**
         * Returns the name of the default group for this class.
         *
         * For each class, the group "Default" is an alias for the group
         * "<ClassName>", where <ClassName> is the non-namespaced name of the
         * class. All constraints implicitly or explicitly assigned to group
         * "Default" belong to both of these groups, unless the class defines
         * a group sequence.
         *
         * If a class defines a group sequence, validating the class in "Default"
         * will validate the group sequence. The constraints assigned to "Default"
         * can still be validated by validating the class in "<ClassName>".
         *
         * @returns The name of the default group
         */
        public readonly defaultGroup: string;

        /**
         * @inheritdoc
         */
        addConstraint(constraint: Constraint): this;

        /**
         * @inheritdoc
         */
        addAttributeMetadata(metadata: MetadataInterface): void;

        /**
         * Adds a constraint to the given property.
         *
         * @param property The name of the property
         * @param constraint The constraint
         */
        addFieldConstraint(property: string, constraint: Constraint): this;

        /**
         * Adds a constraint to the getter of the given property.
         *
         * @param property The name of the property
         * @param constraint The constraint
         */
        addPropertyGetterConstraint(property: string, constraint: Constraint): this;

        /**
         * Adds a constraint to the getter of the given property.
         *
         * @param property The name of the property
         * @param constraint The constraint
         */
        addGetterConstraint(property: string, constraint: Constraint): this;

        /**
         * Adds a constraint to the getter of the given property.
         */
        addGetterMethodConstraint(property: string, method: string, constraint: Constraint): this;

        addFieldConstraints(property: string, constraints: Constraint[]): this;
        addPropertyGetterConstraints(property: string, constraints: Constraint[]): this;
        addGetterConstraints(property: string, constraints: Constraint[]): this;
        addGetterMethodConstraints(property: string, method: string, constraints: Constraint[]): this;

        /**
         * Merges the constraints of the given metadata into this object.
         *
         * @param {Jymfony.Component.Validator.Mapping.ClassMetadata} source
         */
        merge(source: ClassMetadataInterface): void;

        /**
         * @inheritdoc
         */
        public readonly constrainedProperties: string[];

        /**
         * Sets the default group sequence for this class.
         *
         * @param groupSequence An array of group names
         *
         * @throws {Jymfony.Component.Validator.Exception.GroupDefinitionException}
         */
        setGroupSequence(groupSequence: string[] | GroupSequence): this;

        /**
         * @inheritdoc
         */
        hasGroupSequence(): boolean;

        /**
         * @inheritdoc
         */
        public readonly groupSequence: GroupSequence;

        /**
         * Sets whether a group sequence provider should be used.
         */
        setGroupSequenceProvider(active: boolean): void;

        /**
         * @inheritdoc
         */
        public readonly isGroupSequenceProvider: boolean;

        /**
         * Class nodes are never cascaded.
         *
         * @inheritdoc
         */
        public readonly cascadingStrategy: number;

        /**
         * @inheritdoc
         */
        protected _createNullMetadata(name: string): NullMetadata;
    }
}
