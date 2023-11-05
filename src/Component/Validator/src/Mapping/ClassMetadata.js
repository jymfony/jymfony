const BaseClassMetadata = Jymfony.Component.Metadata.ClassMetadata;
const CascadingStrategy = Jymfony.Component.Validator.Mapping.CascadingStrategy;
const ClassMetadataInterface = Jymfony.Component.Validator.Mapping.ClassMetadataInterface;
const Constraint = Jymfony.Component.Validator.Constraint;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const FieldMetadata = Jymfony.Component.Validator.Mapping.FieldMetadata;
const GenericMetadataTrait = Jymfony.Component.Validator.Mapping.GenericMetadataTrait;
const GetterMetadata = Jymfony.Component.Validator.Mapping.GetterMetadata;
const GroupDefinitionException = Jymfony.Component.Validator.Exception.GroupDefinitionException;
const GroupSequence = Jymfony.Component.Validator.Constraints.GroupSequence;
const NullMetadata = Jymfony.Component.Validator.Mapping.NullMetadata;
const PropertyMetadataInterface = Jymfony.Component.Validator.Mapping.PropertyMetadataInterface;
const TraversalStrategy = Jymfony.Component.Validator.Mapping.TraversalStrategy;
const Traverse = Jymfony.Component.Validator.Constraints.Traverse;
const Valid = Jymfony.Component.Validator.Constraints.Valid;

/**
 * Default implementation of {@link ClassMetadataInterface}.
 *
 * This class supports serialization and cloning.
 *
 * @memberOf Jymfony.Component.Validator.Mapping
 */
export default class ClassMetadata extends mix(BaseClassMetadata, ClassMetadataInterface, GenericMetadataTrait) {
    /**
     * @type {string}
     *
     * @private
     */
    _defaultGroup;

    /**
     * @type {string[]}
     *
     * @private
     */
    _groupSequence = null;

    /**
     * @type {boolean}
     *
     * @private
     */
    _groupSequenceProvider = false;

    /**
     * The strategy for traversing traversable objects.
     * By default, only arrays and object literal are traversed.
     *
     * @type {int}
     *
     * @private
     */
    _traversalStrategy = TraversalStrategy.IMPLICIT;

    /**
     * Constructs a metadata for the given class.
     *
     * @param {ReflectionClass} reflectionClass
     */
    __construct(reflectionClass) {
        super.__construct(reflectionClass);
        this._defaultGroup = this.reflectionClass.shortName;
    }

    /**
     * @inheritdoc
     */
    __sleep() {
        const parentProperties = new Set(super.__sleep());

        // Don't store the cascading strategy. Classes never cascade.
        parentProperties.delete('_cascadingStrategy');

        return [
            ...parentProperties,
            '_groupSequence',
            '_groupSequenceProvider',
            '_defaultGroup',
        ];
    }

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
     * @returns {string} The name of the default group
     */
    get defaultGroup() {
        return this._defaultGroup;
    }

    /**
     * @inheritdoc
     */
    addConstraint(constraint) {
        const targets = isArray(constraint.targets) ? constraint.targets : [ constraint.targets ];
        if (! targets.includes(Constraint.CLASS_CONSTRAINT)) {
            throw new ConstraintDefinitionException(__jymfony.sprintf('The constraint "%s" cannot be put on classes.', ReflectionClass.getClassName(constraint)));
        }

        if (constraint instanceof Valid) {
            throw new ConstraintDefinitionException(__jymfony.sprintf('The constraint "%s" cannot be put on classes.', ReflectionClass.getClassName(constraint)));
        }

        if (constraint instanceof Traverse) {
            if (constraint.traverse) {
                // If traverse is true, traversal should be explicitly enabled
                this._traversalStrategy = TraversalStrategy.TRAVERSE;
            } else {
                // If traverse is false, traversal should be explicitly disabled
                this._traversalStrategy = TraversalStrategy.NONE;
            }

            // The constraint is not added
            return this;
        }

        constraint.addImplicitGroupName(this.defaultGroup);
        super.addConstraint(constraint);

        return this;
    }

    /**
     * @inheritdoc
     */
    addAttributeMetadata(metadata) {
        const name = metadata instanceof PropertyMetadataInterface ? metadata.propertyName : metadata.name;

        this._attributesMetadata[name] = metadata;
        this._attributesNames.set(name.toLowerCase(), name);
    }

    /**
     * Adds a constraint to the given property.
     *
     * @param {string} property The name of the property
     * @param {Jymfony.Component.Validator.Constraint} constraint The constraint
     *
     * @returns {Jymfony.Component.Validator.Mapping.ClassMetadata}
     */
    addFieldConstraint(property, constraint) {
        if (undefined === this._attributesMetadata[property]) {
            const memberMetadata = new FieldMetadata(this._reflectionClass.name, property);
            this.addAttributeMetadata(memberMetadata);
        }

        constraint.addImplicitGroupName(this.defaultGroup);
        this._attributesMetadata[property].addConstraint(constraint);

        return this;
    }

    /**
     * @param {string} property
     * @param {Jymfony.Component.Validator.Constraint[]} constraints
     *
     * @returns {Jymfony.Component.Validator.Mapping.ClassMetadata}
     */
    addFieldConstraints(property, constraints) {
        for (const constraint of constraints) {
            this.addFieldConstraint(property, constraint);
        }

        return this;
    }

    /**
     * Adds a constraint to the getter of the given property.
     *
     * @param {string} property The name of the property
     * @param {Jymfony.Component.Validator.Constraint} constraint The constraint
     *
     * @returns {Jymfony.Component.Validator.Mapping.ClassMetadata}
     */
    addPropertyGetterConstraint(property, constraint) {
        if (undefined === this._attributesMetadata[property]) {
            this.addAttributeMetadata(new GetterMetadata(this._reflectionClass.name, property));
        }

        constraint.addImplicitGroupName(this.defaultGroup);
        this._attributesMetadata[property].addConstraint(constraint);

        return this;
    }

    /**
     * Adds a constraint to the getter of the given property.
     *
     * @param {string} property The name of the property
     * @param {Jymfony.Component.Validator.Constraint} constraint The constraint
     *
     * @returns {Jymfony.Component.Validator.Mapping.ClassMetadata}
     */
    addGetterConstraint(property, constraint) {
        if (undefined === this._attributesMetadata[property]) {
            this.addAttributeMetadata(new GetterMetadata(this._reflectionClass.name, property));
        }

        constraint.addImplicitGroupName(this.defaultGroup);
        this._attributesMetadata[property].addConstraint(constraint);

        return this;
    }

    /**
     * @param {string} property
     * @param {Jymfony.Component.Validator.Constraint[]} constraints
     *
     * @returns {Jymfony.Component.Validator.Mapping.ClassMetadata}
     */
    addPropertyGetterConstraints(property, constraints) {
        for (const constraint of constraints) {
            this.addPropertyGetterConstraint(property, constraint);
        }

        return this;
    }

    /**
     * @param {string} property
     * @param {Jymfony.Component.Validator.Constraint[]} constraints
     *
     * @returns {Jymfony.Component.Validator.Mapping.ClassMetadata}
     */
    addGetterConstraints(property, constraints) {
        for (const constraint of constraints) {
            this.addGetterConstraint(property, constraint);
        }

        return this;
    }

    /**
     * Adds a constraint to the getter of the given property.
     *
     * @param {string} property
     * @param {string} method
     * @param {Jymfony.Component.Validator.Constraint} constraint
     *
     * @returns {Jymfony.Component.Validator.Mapping.ClassMetadata}
     */
    addGetterMethodConstraint(property, method, constraint) {
        if (undefined === this._attributesMetadata[property]) {
            this.addAttributeMetadata(new GetterMetadata(this._reflectionClass.name, property, method));
        }

        constraint.addImplicitGroupName(this.defaultGroup);
        this._attributesMetadata[property].addConstraint(constraint);

        return this;
    }

    /**
     * @param {string} property
     * @param {string} method
     * @param {Jymfony.Component.Validator.Constraint[]} constraints
     *
     * @returns {Jymfony.Component.Validator.Mapping.ClassMetadata}
     */
    addGetterMethodConstraints(property, method, constraints) {
        for (const constraint of constraints) {
            this.addGetterMethodConstraint(property, method, constraint);
        }

        return this;
    }

    /**
     * Merges the constraints of the given metadata into this object.
     *
     * @param {Jymfony.Component.Validator.Mapping.ClassMetadata} source
     */
    merge(source) {
        if (source.isGroupSequenceProvider) {
            this.setGroupSequenceProvider(true);
        }

        for (const constraint of source.constraints) {
            this.addConstraint(__jymfony.clone(constraint));
        }

        for (let [ , member ] of __jymfony.getEntries(this._attributesMetadata)) {
            member = __jymfony.clone(member);
            __assert(member instanceof Jymfony.Component.Validator.Mapping.MemberMetadata);

            for (const constraint of member.constraints) {
                if (constraint.groups.includes(Constraint.DEFAULT_GROUP)) {
                    member._constraintsByGroup[this.defaultGroup].push(constraint);
                }

                constraint.addImplicitGroupName(this.defaultGroup);
            }

            this.addAttributeMetadata(member);
        }
    }

    /**
     * @inheritdoc
     */
    get constrainedProperties() {
        return Object.keys(this._attributesMetadata);
    }

    /**
     * Sets the default group sequence for this class.
     *
     * @param {string[]|Jymfony.Component.Validator.Constraints.GroupSequence} groupSequence An array of group names
     *
     * @returns {Jymfony.Component.Validator.Mapping.ClassMetadata}
     *
     * @throws {Jymfony.Component.Validator.Exception.GroupDefinitionException}
     */
    setGroupSequence(groupSequence) {
        if (this.isGroupSequenceProvider) {
            throw new GroupDefinitionException('Defining a static group sequence is not allowed with a group sequence provider');
        }

        if (isArray(groupSequence)) {
            groupSequence = new GroupSequence(groupSequence);
        }

        if (groupSequence.groups.includes(Constraint.DEFAULT_GROUP)) {
            throw new GroupDefinitionException(__jymfony.sprintf('The group "%s" is not allowed in group sequences', Constraint.DEFAULT_GROUP));
        }

        if (! groupSequence.groups.includes(this.defaultGroup)) {
            throw new GroupDefinitionException(__jymfony.sprintf('The group "%s" is missing in the group sequence', this.defaultGroup));
        }

        this._groupSequence = groupSequence;

        return this;
    }

    /**
     * @inheritdoc
     */
    hasGroupSequence() {
        return this._groupSequence && 0 < this._groupSequence.groups.length;
    }

    /**
     * @inheritdoc
     */
    get groupSequence() {
        return this._groupSequence;
    }

    /**
     * Sets whether a group sequence provider should be used.
     *
     * @param {boolean} active
     *
     * @throws {Jymfony.Component.Validator.Exception.GroupDefinitionException}
     */
    setGroupSequenceProvider(active) {
        if (this.hasGroupSequence()) {
            throw new GroupDefinitionException('Defining a group sequence provider is not allowed with a static group sequence');
        }

        if (! this._reflectionClass.isInstanceOf('Jymfony.Component.Validator.GroupSequenceProviderInterface')) {
            throw new GroupDefinitionException(__jymfony.sprintf('Class "%s" must implement GroupSequenceProviderInterface', this.name));
        }

        this._groupSequenceProvider = active;
    }

    /**
     * @inheritdoc
     */
    get isGroupSequenceProvider() {
        return this._groupSequenceProvider;
    }

    /**
     * Class nodes are never cascaded.
     *
     * @inheritdoc
     */
    get cascadingStrategy() {
        return CascadingStrategy.NONE;
    }

    /**
     * @inheritdoc
     */
    _createNullMetadata(name) {
        return new NullMetadata(name);
    }
}
