const CascadingStrategy = Jymfony.Component.Validator.Mapping.CascadingStrategy;
const TraversalStrategy = Jymfony.Component.Validator.Mapping.TraversalStrategy;
const Traverse = Jymfony.Component.Validator.Constraints.Traverse;
const Valid = Jymfony.Component.Validator.Constraints.Valid;

/**
 * A trait for generic containers of {@link Constraint} objects.
 *
 * This class supports serialization and cloning.
 *
 * @memberOf Jymfony.Component.Validator.Mapping
 */
class GenericMetadataTrait {
    __construct() {
        /**
         * @type {Jymfony.Component.Validator.Constraint[]}
         */
        this._constraints = [];

        /**
         * @type {Object.<string, Jymfony.Component.Validator.Constraint[]>}
         */
        this._constraintsByGroup = {};

        /**
         * The strategy for cascading objects.
         *
         * By default, objects are not cascaded.
         *
         * @type {int}
         *
         * @see {Jymfony.Component.Validator.Mapping.CascadingStrategy}
         */
        this._cascadingStrategy = CascadingStrategy.NONE;

        /**
         * The strategy for traversing traversable objects.
         *
         * By default, traversable objects are not traversed.
         *
         * @type {int}
         *
         * @see {Jymfony.Component.Validator.Mapping.TraversalStrategy}
         */
        this._traversalStrategy = TraversalStrategy.NONE;
    }

    /**
     * Returns the names of the properties that should be serialized.
     *
     * @returns {string[]}
     */
    __sleep() {
        const parentSleep = super.__sleep ? super.__sleep() : [];

        return [
            ...parentSleep,
            '_constraints',
            '_cascadingStrategy',
            '_traversalStrategy',
        ];
    }

    __wakeup() {
        if (super.__wakeup) {
            super.__wakeup();
        }

        const constraints = [ ...this._constraints ];

        this._constraints = [];
        this._constraintsByGroup = {};

        for (const constraint of constraints) {
            this.addConstraint(constraint);
        }
    }

    /**
     * Clones this object.
     */
    __clone() {
        const constraints = [ ...this._constraints ];

        this._constraints = [];
        this._constraintsByGroup = {};

        for (const constraint of constraints) {
            this.addConstraint(__jymfony.clone(constraint));
        }
    }

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
     * @returns {Jymfony.Component.Validator.Mapping.GenericMetadata}
     *
     * @throws {Jymfony.Component.Validator.Exception.ConstraintDefinitionException}
     *          When trying to add the {@link Traverse} constraint
     */
    addConstraint(constraint) {
        if (constraint instanceof Traverse) {
            throw new ConstraintDefinitionException(__jymfony.sprintf('The constraint "%s" can only be put on classes. Please use "Jymfony.Component.Validator.Constraints.Valid" instead.', ReflectionClass.getClassName(constraint)));
        }

        if (constraint instanceof Valid && null === constraint.groups) {
            this._cascadingStrategy = CascadingStrategy.CASCADE;

            if (constraint.traverse) {
                this._traversalStrategy = TraversalStrategy.IMPLICIT;
            } else {
                this._traversalStrategy = TraversalStrategy.NONE;
            }

            return this;
        }

        this._constraints.push(constraint);

        for (const group of constraint.groups) {
            if (undefined === this._constraintsByGroup[group]) {
                this._constraintsByGroup[group] = [];
            }

            this._constraintsByGroup[group].push(constraint);
        }

        return this;
    }

    /**
     * @inheritdoc
     */
    get cascadingStrategy() {
        return this._cascadingStrategy;
    }

    /**
     * @inheritdoc
     */
    get traversalStrategy() {
        return this._traversalStrategy;
    }

    /**
     * @inheritdoc
     */
    get constraints() {
        return [ ...this._constraints ];
    }

    /**
     * Adds an list of constraints.
     *
     * @param {Jymfony.Component.Validator.Constraint[]} constraints The constraints to add
     *
     * @returns {Jymfony.Component.Validator.Mapping.GenericMetadata}
     */
    addConstraints(constraints) {
        for (const constraint of constraints) {
            this.addConstraint(constraint);
        }

        return this;
    }

    /**
     * Returns whether this element has any constraints.
     *
     * @returns {boolean}
     */
    hasConstraints() {
        return 0 < this._constraints.length;
    }

    /**
     * @inheritdoc
     *
     * Aware of the global group (* group).
     */
    findConstraints(group) {
        return this._constraintsByGroup[group] || [];
    }
}

export default getTrait(GenericMetadataTrait);
