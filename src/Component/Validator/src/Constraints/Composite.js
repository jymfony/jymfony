const Constraint = Jymfony.Component.Validator.Constraint;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const Valid = Jymfony.Component.Validator.Constraints.Valid;

/**
 * A constraint that is composed of other constraints.
 *
 * You should never use the nested constraint instances anywhere else, because
 * their groups are adapted when passed to the constructor of this class.
 *
 * @memberOf Jymfony.Component.Validator.Constraints
 * @internal
 */
export default class Composite extends Constraint {
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
    __construct(options = null) {
        const ret = super.__construct(options);

        this._initializeNestedConstraints();

        const compositeOption = this._getCompositeOption();
        let nestedConstraints = this[compositeOption];

        if (! isArray(nestedConstraints) && ! isObjectLiteral(nestedConstraints)) {
            nestedConstraints = [ nestedConstraints ];
        }

        for (let constraint of Object.values(nestedConstraints)) {
            if (! (constraint instanceof Constraint)) {
                if (isObject(constraint)) {
                    constraint = ReflectionClass.getClassName(constraint);
                }

                throw new ConstraintDefinitionException(__jymfony.sprintf('The value "%s" is not an instance of Constraint in constraint "%s".', constraint, ReflectionClass.getClassName(this)));
            }

            if (constraint instanceof Valid) {
                throw new ConstraintDefinitionException(__jymfony.sprintf('The constraint Valid cannot be nested inside constraint "%s". You can only declare the Valid constraint directly on a field or method.', ReflectionClass.getClassName(this)));
            }
        }

        if (undefined !== this.groups) {
            const mergedGroups = new Set();

            for (const constraint of Object.values(nestedConstraints)) {
                for (const group of constraint.groups) {
                    mergedGroups.add(group);
                }
            }

            this.groups = [ ...mergedGroups ];
            this[compositeOption] = nestedConstraints;

            return;
        }

        for (const constraint of Object.values(nestedConstraints)) {
            if (undefined !== constraint.groups) {
                const excessGroups = constraint.groups.filter(g => ! this.groups.includes(g));

                if (0 < excessGroups.length) {
                    throw new ConstraintDefinitionException(__jymfony.sprintf('The group(s) "%s" passed to the constraint "%s" should also be passed to its containing constraint "%s".', excessGroups.join('", "'), __jymfony.get_debug_type(constraint), ReflectionClass.getClassName(this)));
                }
            } else {
                constraint.groups = this.groups;
            }
        }

        this[compositeOption] = nestedConstraints;

        return ret;
    }

    /**
     * @inheritdoc
     *
     * Implicit group names are forwarded to nested constraints.
     *
     * @param {string} group
     */
    addImplicitGroupName(group) {
        super.addImplicitGroupName(group);

        /** @var Constraint[] $nestedConstraints */
        const nestedConstraints = this[this._getCompositeOption()];

        for (const constraint of Object.values(nestedConstraints)) {
            constraint.addImplicitGroupName(group);
        }
    }

    /**
     * Returns the name of the property that contains the nested constraints.
     *
     * @returns {string} The property name
     *
     * @abstract
     * @protected
     */
    _getCompositeOption() {
        throw new Error('_getCompositeMethod must be implemented by subclass');
    }

    /**
     * Initializes the nested constraints.
     *
     * This method can be overwritten in subclasses to clean up the nested
     * constraints passed to the constructor.
     *
     * @see Jymfony.Component.Validator.Constraints.Collection._initializeNestedConstraints()
     *
     * @protected
     */
    _initializeNestedConstraints() {
    }
}
