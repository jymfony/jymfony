declare namespace Jymfony.Component.Validator.Constraints {
    import Constraint = Jymfony.Component.Validator.Constraint;
    import ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;

    /**
     * A constraint that is composed of other constraints.
     *
     * You should never use the nested constraint instances anywhere else, because
     * their groups are adapted when passed to the constructor of this class.
     *
     * @internal
     */
    export abstract class Composite extends Constraint {
        /**
         * @inheritdoc
         *
         * The groups of the composite and its nested constraints are made
         * consistent using the following strategy:
         *
         *   - If groups are passed explicitly to the composite constraint, but
         *     not to the nested constraints, the options of the composite
         *     constraint are copied to the nested constraints;
         *
         *   - If groups are passed explicitly to the nested constraints, but not
         *     to the composite constraint, the groups of all nested constraints
         *     are merged and used as groups for the composite constraint;
         *
         *   - If groups are passed explicitly to both the composite and its nested
         *     constraints, the groups of the nested constraints must be a subset
         *     of the groups of the composite constraint. If not, a
         *     {@link ConstraintDefinitionException} is thrown.
         *
         * All this is done in the constructor, because constraints can then be
         * cached. When constraints are loaded from the cache, no more group
         * checks need to be done.
         */
        __construct(options?: null | any): this;
        constructor(options?: null | any);

        /**
         * @inheritdoc
         *
         * Implicit group names are forwarded to nested constraints.
         */
        addImplicitGroupName(group: string): void;

        /**
         * Returns the name of the property that contains the nested constraints.
         *
         * @returns The property name
         */
        protected abstract _getCompositeOption(): string;

        /**
         * Initializes the nested constraints.
         *
         * This method can be overwritten in subclasses to clean up the nested
         * constraints passed to the constructor.
         *
         * @see Jymfony.Component.Validator.Constraints.Collection._initializeNestedConstraints()
         */
        protected _initializeNestedConstraints(): void;
    }
}
