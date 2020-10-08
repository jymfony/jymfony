declare namespace Jymfony.Component.Validator.Mapping {
    import CascadingStrategy = Jymfony.Component.Validator.Mapping.CascadingStrategy;
    import Constraint = Jymfony.Component.Validator.Constraint;
    import TraversalStrategy = Jymfony.Component.Validator.Mapping.TraversalStrategy;

    /**
     * A trait for generic containers of {@link Constraint} objects.
     *
     * This class supports serialization and cloning.
     */
    class GenericMetadataTrait {
        public static readonly definition: Newable<GenericMetadataTrait>;
        private _constraints: Constraint[];
        private _constraintsByGroup: Record<string, Constraint[]>;

        /**
         * The strategy for cascading objects.
         * By default, objects are not cascaded.
         */
        private _cascadingStrategy: number;

        /**
         * The strategy for traversing traversable objects.
         * By default, traversable objects are not traversed.
         */
        private _traversalStrategy: number;

        __construct(): void;

        /**
         * Returns the names of the properties that should be serialized.
         */
        __sleep(): string[];
        __wakeup(): void;

        /**
         * Clones this object.
         */
        __clone(): void;

        /**
         * Adds a constraint.
         *
         * If the constraint {@link Valid} is added, the cascading strategy will be
         * changed to {@link CascadingStrategy.CASCADE}. Depending on the
         * traverse property of that constraint, the traversal strategy
         * will be set to one of the following:
         *
         *  - {@link TraversalStrategy.IMPLICIT} if traverse is enabled
         *  - {@link TraversalStrategy.NONE} if traverse is disabled
         *
         * @throws {Jymfony.Component.Validator.Exception.ConstraintDefinitionException}
         *          When trying to add the {@link Traverse} constraint
         */
        addConstraint(constraint: Constraint): this;

        /**
         * @inheritdoc
         */
        public readonly cascadingStrategy: number;

        /**
         * @inheritdoc
         */
        public readonly traversalStrategy: number;

        /**
         * @inheritdoc
         */
        public readonly constraints: Constraint[];

        /**
         * Adds an list of constraints.
         *
         * @param constraints The constraints to add
         */
        addConstraints(constraints: Constraint[]): this;

        /**
         * Returns whether this element has any constraints.
         */
        hasConstraints(): boolean;

        /**
         * @inheritdoc
         *
         * Aware of the global group (* group).
         */
        findConstraints(group: string): Constraint[];
    }
}
