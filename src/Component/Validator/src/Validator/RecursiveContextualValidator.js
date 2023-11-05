const CascadingStrategy = Jymfony.Component.Validator.Mapping.CascadingStrategy;
const ClassMetadataInterface = Jymfony.Component.Validator.Mapping.ClassMetadataInterface;
const Constraint = Jymfony.Component.Validator.Constraint;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const ContextualValidatorInterface = Jymfony.Component.Validator.Validator.ContextualValidatorInterface;
const ExecutionContext = Jymfony.Component.Validator.Context.ExecutionContext;
const GenericMetadata = Jymfony.Component.Validator.Mapping.GenericMetadata;
const GetterMetadata = Jymfony.Component.Validator.Mapping.GetterMetadata;
const GroupSequence = Jymfony.Component.Validator.Constraints.GroupSequence;
const LazyProperty = Jymfony.Component.Validator.Validator.LazyProperty;
const NoSuchMetadataException = Jymfony.Component.Validator.Exception.NoSuchMetadataException;
const NullMetadata = Jymfony.Contracts.Metadata.NullMetadata;
const PropertyMetadataInterface = Jymfony.Component.Validator.Mapping.PropertyMetadataInterface;
const PropertyPath = Jymfony.Component.Validator.Util.PropertyPath;
const RuntimeException = Jymfony.Component.Validator.Exception.RuntimeException;
const TraversalStrategy = Jymfony.Component.Validator.Mapping.TraversalStrategy;
const UnexpectedValueException = Jymfony.Component.Validator.Exception.UnexpectedValueException;
const UnsupportedMetadataException = Jymfony.Component.Validator.Exception.UnsupportedMetadataException;
const ValidatorException = Jymfony.Component.Validator.Exception.ValidatorException;

const iterable = v => isArray(v) || isObjectLiteral(v) || v instanceof Set || v instanceof Map;

/**
 * Recursive implementation of {@link ContextualValidatorInterface}.
 *
 * @memberOf Jymfony.Component.Validator.Validator
 */
export default class RecursiveContextualValidator extends implementationOf(ContextualValidatorInterface) {
    /**
     * @type {Jymfony.Component.Validator.Context.ExecutionContextInterface}
     *
     * @private
     */
    _context;

    /**
     * @type {string}
     *
     * @private
     */
    _defaultPropertyPath;

    /**
     * @type {string[]}
     *
     * @private
     */
    _defaultGroups;

    /**
     * @type {Jymfony.Contracts.Metadata.MetadataFactoryInterface<Jymfony.Component.Validator.Mapping.ClassMetadataInterface>}
     *
     * @private
     */
    _metadataFactory;

    /**
     * @type {Jymfony.Component.Validator.ConstraintValidatorFactoryInterface}
     *
     * @private
     */
    _validatorFactory;

    /**
     * Creates a validator for the given context.
     *
     * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
     * @param {Jymfony.Contracts.Metadata.MetadataFactoryInterface} metadataFactory
     * @param {Jymfony.Component.Validator.ConstraintValidatorFactoryInterface} validatorFactory
     */
    __construct(context, metadataFactory, validatorFactory) {
        this._context = context;
        this._defaultPropertyPath = context.getPropertyPath();
        this._defaultGroups = [ context.group || Constraint.DEFAULT_GROUP ];
        this._metadataFactory = metadataFactory;
        this._validatorFactory = validatorFactory;
    }

    /**
     * @inheritdoc
     */
    atPath(path) {
        this._defaultPropertyPath = this._context.getPropertyPath(path);

        return this;
    }

    /**
     * @inheritdoc
     */
    async validate(value, constraints = null, groups = null) {
        groups = groups ? this._normalizeGroups(groups) : this._defaultGroups;

        const previousValue = this._context.value;
        const previousObject = this._context.object;
        const previousMetadata = this._context.metadata;
        const previousPath = this._context.getPropertyPath();
        const previousGroup = this._context.group;
        let previousConstraint = null;

        if (this._context instanceof ExecutionContext || isFunction(this._context.getConstraint)) {
            previousConstraint = this._context.getConstraint();
        }

        // If explicit constraints are passed, validate the value against those constraints
        if (null !== constraints) {
            // You can pass a single constraint or an array of constraints
            // Make sure to deal with an array in the rest of the code
            if (! isArray(constraints)) {
                constraints = [ constraints ];
            }

            const metadata = new GenericMetadata();
            metadata.addConstraints(constraints);

            await this._validateGenericNode(
                value,
                previousObject,
                isObject(value) && ! iterable(value) ? previousObject : null,
                metadata,
                this._defaultPropertyPath,
                [ ...groups ],
                null,
                TraversalStrategy.IMPLICIT,
                this._context
            );

            this._context.setNode(previousValue, previousObject, previousMetadata, previousPath);
            this._context.setGroup(previousGroup);

            if (null !== previousConstraint) {
                this._context.setConstraint(previousConstraint);
            }

            return this;
        }

        /*
         * If an object is passed without explicit constraints, validate that
         * object against the constraints defined for the object's class
         */
        if (isObject(value)) {
            await this._validateObject(
                value,
                this._defaultPropertyPath,
                [ ...groups ],
                TraversalStrategy.IMPLICIT,
                this._context
            );

            this._context.setNode(previousValue, previousObject, previousMetadata, previousPath);
            this._context.setGroup(previousGroup);

            return this;
        }

        // If an array is passed without explicit constraints, validate each object in the array
        if (iterable(value)) {
            await this._validateEachObjectIn(
                value,
                this._defaultPropertyPath,
                [ ...groups ],
                this._context
            );

            this._context.setNode(previousValue, previousObject, previousMetadata, previousPath);
            this._context.setGroup(previousGroup);

            return this;
        }

        throw new RuntimeException(__jymfony.sprintf('Cannot validate values of type "%s" automatically. Please provide a constraint.', typeof value));
    }

    /**
     * @inheritdoc
     */
    async validateProperty(object, propertyName, groups = null) {
        const classMetadata = this._metadataFactory.getMetadataFor(object);
        if (! (classMetadata instanceof ClassMetadataInterface)) {
            throw new ValidatorException(__jymfony.sprintf('The metadata factory should return instances of "Jymfony.Component.Validator.Mapping.ClassMetadataInterface", got: "%s".', __jymfony.get_debug_type(classMetadata)));
        }

        const propertyMetadata = classMetadata.getAttributeMetadata(propertyName);
        if (propertyMetadata instanceof NullMetadata) {
            return this;
        }

        groups = groups ? this._normalizeGroups(groups) : [ ...this._defaultGroups ];
        const propertyPath = PropertyPath.append(this._defaultPropertyPath, propertyName);

        const previousValue = this._context.value;
        const previousObject = this._context.object;
        const previousMetadata = this._context.metadata;
        const previousPath = this._context.getPropertyPath();
        const previousGroup = this._context.group;

        const propertyValue = await propertyMetadata.getPropertyValue(object);

        await this._validateGenericNode(
            propertyValue,
            object,
            object,
            propertyMetadata,
            propertyPath,
            [ ...groups ],
            null,
            TraversalStrategy.IMPLICIT,
            this._context
        );

        this._context.setNode(previousValue, previousObject, previousMetadata, previousPath);
        this._context.setGroup(previousGroup);

        return this;
    }

    /**
     * @inheritdoc
     */
    async validatePropertyValue(objectOrClass, propertyName, value, groups = null) {
        const classMetadata = this._metadataFactory.getMetadataFor(objectOrClass);
        if (! (classMetadata instanceof ClassMetadataInterface)) {
            throw new ValidatorException(__jymfony.sprintf('The metadata factory should return instances of "Jymfony.Component.Validator.Mapping.ClassMetadataInterface", got: "%s".', __jymfony.get_debug_type(classMetadata)));
        }

        const propertyMetadata = classMetadata.getAttributeMetadata(propertyName);
        if (propertyMetadata instanceof NullMetadata) {
            return this;
        }

        groups = groups ? this._normalizeGroups(groups) : this._defaultGroups;

        let object, propertyPath;
        if (isObject(objectOrClass)) {
            object = objectOrClass;
            propertyPath = PropertyPath.append(this._defaultPropertyPath, propertyName);
        } else {
            // $objectOrClass contains a class name
            object = null;
            propertyPath = this._defaultPropertyPath;
        }

        const previousValue = this._context.value;
        const previousObject = this._context.object;
        const previousMetadata = this._context.metadata;
        const previousPath = this._context.getPropertyPath();
        const previousGroup = this._context.group;

        await this._validateGenericNode(
            value,
            object,
            object,
            propertyMetadata,
            propertyPath,
            [ ...groups ],
            null,
            TraversalStrategy.IMPLICIT,
            this._context
        );

        this._context.setNode(previousValue, previousObject, previousMetadata, previousPath);
        this._context.setGroup(previousGroup);

        return this;
    }

    /**
     * @inheritdoc
     */
    get violations() {
        return this._context.violations;
    }

    /**
     * Normalizes the given group or list of groups to an array.
     *
     * @param {string|Jymfony.Component.Validator.Constraints.GroupSequence|(string|Jymfony.Component.Validator.Constraints.GroupSequence)[]} groups The groups to normalize
     *
     * @returns {(string|Jymfony.Component.Validator.Constraints.GroupSequence)[]} A group array
     *
     * @protected
     */
    _normalizeGroups(groups) {
        if (isArray(groups)) {
            return groups;
        }

        return [ groups ];
    }

    /**
     * Validates an object against the constraints defined for its class.
     *
     * If no metadata is available for the class, but the class implements
     * {@link Symbol.iterator} and the selected traversal strategy allows
     * traversal, the object will be iterated and each nested object will be
     * validated instead.
     *
     * @throws {Jymfony.Component.Validator.Exception.NoSuchMetadataException}
     *              If the object has no associated metadata and does not
     *              implement {@link Symbol.iterator} or if traversal is disabled
     *              via the traversalStrategy argument
     * @throws {Jymfony.Component.Validator.Exception.UnsupportedMetadataException}
     *              If the metadata returned by the metadata factory does not implement
     *              {@link Jymfony.Component.Validator.Mapping.ClassMetadataInterface}
     *
     * @private
     */
    async _validateObject(object, propertyPath, groups, traversalStrategy, context) {
        try {
            const classMetadata = this._metadataFactory.getMetadataFor(object);

            if (! (classMetadata instanceof ClassMetadataInterface)) {
                throw new UnsupportedMetadataException(__jymfony.sprintf('The metadata factory should return instances of "Jymfony.Component.Validator.Mapping.ClassMetadataInterface", got: "%s".', __jymfony.get_debug_type(classMetadata)));
            }

            await this._validateClassNode(
                object,
                classMetadata,
                propertyPath,
                [ ...groups ],
                null,
                traversalStrategy,
                context
            );
        } catch (e) {
            if (! (e instanceof NoSuchMetadataException)) {
                throw e;
            }

            // Rethrow if not iterable
            if (! iterable(object)) {
                throw e;
            }

            // Rethrow unless IMPLICIT or TRAVERSE
            if (! (traversalStrategy & (TraversalStrategy.IMPLICIT | TraversalStrategy.TRAVERSE))) {
                throw e;
            }

            await this._validateEachObjectIn(object, propertyPath, [ ...groups ], context);
        }
    }

    /**
     * Validates each object in a collection against the constraints defined
     * for their classes.
     *
     * Nested arrays are also iterated.
     *
     * @param {*[]|Object.<*, *>} collection
     * @param {string} propertyPath
     * @param {string[]} groups
     * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
     *
     * @private
     */
    async _validateEachObjectIn(collection, propertyPath, groups, context) {
        for (const [ key, value ] of __jymfony.getEntries(collection)) {
            if (iterable(value)) {
                // Also traverse nested arrays
                await this._validateEachObjectIn(value, propertyPath + '[' + key + ']', [ ...groups ], context);
                continue;
            }

            // Scalar and null values in the collection are ignored
            if (isObject(value)) {
                await this._validateObject(value, propertyPath + '[' + key + ']', [ ...groups ], TraversalStrategy.IMPLICIT, context);
            }
        }
    }

    /**
     * Validates a class node.
     *
     * A class node is a combination of an object with a {@link ClassMetadataInterface}
     * instance. Each class node (conceptually) has zero or more succeeding
     * property nodes:
     *
     *     (Article:class node)
     *                \
     *        ($title:property node)
     *
     * This method validates the passed objects against all constraints defined
     * at class level. It furthermore triggers the validation of each of the
     * class' properties against the constraints for that property.
     *
     * If the selected traversal strategy allows traversal, the object is
     * iterated and each nested object is validated against its own constraints.
     * The object is not traversed if traversal is disabled in the class
     * metadata.
     *
     * If the passed groups contain the group "Default", the validator will
     * check whether the "Default" group has been replaced by a group sequence
     * in the class metadata. If this is the case, the group sequence is
     * validated instead.
     *
     * @param {Object} object
     * @param {Jymfony.Component.Validator.Mapping.ClassMetadataInterface} metadata
     * @param {string} propertyPath
     * @param {string[]} groups
     * @param {null|string[]} cascadedGroups
     * @param {int} traversalStrategy
     * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
     *
     * @throws {Jymfony.Component.Validator.Exception.UnsupportedMetadataException}
     *              If a property metadata does not implement
     *              {@link Jymfony.Component.Validator.Mapping.PropertyMetadataInterface}
     * @throws {Jymfony.Component.Validator.Exception.ConstraintDefinitionException}
     *              If traversal was enabled but the object is not traversable.
     *
     * @see Jymfony.Component.Validator.Mapping.TraversalStrategy
     *
     * @private
     */
    async _validateClassNode(object, metadata, propertyPath, groups, cascadedGroups, traversalStrategy, context) {
        context.setNode(object, object, metadata, propertyPath);

        for (let [ key, group ] of __jymfony.getEntries(groups)) {
            /*
             * If the "Default" group is replaced by a group sequence, remember
             * to cascade the "Default" group when traversing the group sequence
             */
            let defaultOverridden = false;

            if (context.isGroupValidated(object, group)) {
                // Skip this group when validating the properties and when traversing the object
                delete groups[key];

                continue;
            }

            context.markGroupAsValidated(object, group);

            /*
             * Replace the "Default" group by the group sequence defined
             * for the class, if applicable.
             * This is done after checking the cache. This is useful
             * if the getters below return different group sequences in
             * every call.
             */
            if (group === Constraint.DEFAULT_GROUP) {
                if (metadata.hasGroupSequence()) {
                    // The group sequence is statically defined for the class
                    group = metadata.groupSequence;
                    defaultOverridden = true;
                } else if (metadata.isGroupSequenceProvider) {
                    // The group sequence is dynamically obtained from the validated object
                    group = object.groupSequence;
                    defaultOverridden = true;

                    if (! (group instanceof GroupSequence)) {
                        group = new GroupSequence(group);
                    }
                }
            }

            /*
             * If the groups (=[<G1,G2>,G3,G4]) contain a group sequence
             * (=<G1,G2>), then call validateClassNode() with each entry of the
             * group sequence and abort if necessary (G1, G2)
             */
            if (group instanceof GroupSequence) {
                await this._stepThroughGroupSequence(
                    object,
                    object,
                    metadata,
                    propertyPath,
                    traversalStrategy,
                    group,
                    defaultOverridden ? Constraint.DEFAULT_GROUP : null,
                    context
                );

                /*
                 * Skip the group sequence when validating properties, because
                 * stepThroughGroupSequence() already validates the properties
                 */
                delete groups[key];

                continue;
            }

            await this._validateInGroup(object, object, metadata, group, context);
        }

        // If no more groups should be validated for the property nodes, we can safely quit
        if (0 === Object.keys(groups).length) {
            return;
        }

        // Validate all properties against their constraints
        for (const propertyName of metadata.constrainedProperties) {
            const propertyMetadata = metadata.getAttributeMetadata(propertyName);
            if (! (propertyMetadata instanceof PropertyMetadataInterface)) {
                throw new UnsupportedMetadataException(__jymfony.sprintf('The property metadata instances should implement "Jymfony.Component.Validator.Mapping.PropertyMetadataInterface", got: "%s".', __jymfony.get_debug_type(propertyMetadata)));
            }

            let propertyValue;
            if (propertyMetadata instanceof GetterMetadata) {
                propertyValue = new LazyProperty(() => {
                    return propertyMetadata.getPropertyValue(object);
                });
            } else {
                propertyValue = propertyMetadata.getPropertyValue(object);
            }

            propertyValue = await propertyValue;

            await this._validateGenericNode(
                propertyValue,
                object,
                object,
                propertyMetadata,
                PropertyPath.append(propertyPath, propertyName),
                [ ...groups ],
                cascadedGroups,
                TraversalStrategy.IMPLICIT,
                context
            );
        }

        // If no specific traversal strategy was requested when this method was called, use the traversal strategy of the class' metadata
        if (traversalStrategy & TraversalStrategy.IMPLICIT) {
            traversalStrategy = metadata.traversalStrategy;
        }

        // Traverse only if IMPLICIT or TRAVERSE
        if (!( traversalStrategy & (TraversalStrategy.IMPLICIT | TraversalStrategy.TRAVERSE))) {
            return;
        }

        // If IMPLICIT, stop unless we deal with an iterable
        if (traversalStrategy & TraversalStrategy.IMPLICIT && ! iterable(object)) {
            return;
        }

        // If TRAVERSE, fail if we have no Traversable
        if (! iterable(object)) {
            throw new ConstraintDefinitionException(__jymfony.sprintf(
                'Traversal was enabled for "%s", but the object is not traversable".',
                ReflectionClass.getClassName(object)
            ));
        }

        await this._validateEachObjectIn(object, propertyPath, [ ...groups ], context);
    }

    /**
     * Validates a node that is not a class node.
     *
     * Currently, two such node types exist:
     *
     *  - property nodes, which consist of the value of an object's
     *    property together with a {@link PropertyMetadataInterface} instance
     *  - generic nodes, which consist of a value and some arbitrary
     *    constraints defined in a {@link MetadataInterface} container
     *
     * In both cases, the value is validated against all constraints defined
     * in the passed metadata object. Then, if the value is traversable and
     * the selected traversal strategy permits it, the value is traversed and
     * each nested object validated against its own constraints. If the value
     * is an array, it is traversed regardless of the given strategy.
     *
     * @param {*} value
     * @param {*} object
     * @param {*} cacheObject
     * @param {Jymfony.Contracts.Metadata.MetadataInterface} metadata
     * @param {string} propertyPath
     * @param {string[]} groups
     * @param {null|string[]} cascadedGroups
     * @param {int} traversalStrategy
     * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
     *
     * @see TraversalStrategy
     */
    async _validateGenericNode(value, object, cacheObject, metadata, propertyPath, groups, cascadedGroups, traversalStrategy, context) {
        context.setNode(value, object, metadata, propertyPath);

        for (const [ key, group ] of __jymfony.getEntries(groups)) {
            if (group instanceof GroupSequence) {
                await this._stepThroughGroupSequence(
                    value,
                    object,
                    metadata,
                    propertyPath,
                    traversalStrategy,
                    group,
                    null,
                    context
                );

                /*
                 * Skip the group sequence when cascading, as the cascading
                 * logic is already done in _stepThroughGroupSequence()
                 */
                delete groups[key];

                continue;
            }

            await this._validateInGroup(value, cacheObject, metadata, group, context);
        }

        if (0 === groups.length) {
            return;
        }

        if (null === value || undefined === value) {
            return;
        }

        const cascadingStrategy = metadata.cascadingStrategy;

        // Quit unless we cascade
        if (!(cascadingStrategy & CascadingStrategy.CASCADE)) {
            return;
        }

        // If no specific traversal strategy was requested when this method was called, use the traversal strategy of the node's metadata
        if (traversalStrategy & TraversalStrategy.IMPLICIT) {
            traversalStrategy = metadata.traversalStrategy;
        }

        // The cascadedGroups property is set, if the "Default" group is overridden by a group sequence
        // See validateClassNode()
        cascadedGroups = null !== cascadedGroups && 0 < cascadedGroups.length ? [ ...cascadedGroups ] : [ ...groups ];

        if (value instanceof LazyProperty) {
            value = await value.getPropertyValue();

            if (null === value || undefined === value) {
                return;
            }
        }

        if (iterable(value)) {
            // Arrays are always traversed, independent of the specified traversal strategy
            await this._validateEachObjectIn(
                value,
                propertyPath,
                cascadedGroups,
                context
            );

            return;
        }

        // If the value is a scalar, pass it anyway, because we want a NoSuchMetadataException to be thrown in that case
        await this._validateObject(
            value,
            propertyPath,
            cascadedGroups,
            traversalStrategy,
            context
        );

        /*
         * Currently, the traversal strategy can only be TRAVERSE for a
         * generic node if the cascading strategy is CASCADE. Thus, traversable
         * objects will always be handled within validateObject() and there's
         * nothing more to do here.
         *
         * see GenericMetadata::addConstraint()
         */
    }

    /**
     * Sequentially validates a node's value in each group of a group sequence.
     *
     * If any of the constraints generates a violation, subsequent groups in the
     * group sequence are skipped.
     *
     * @param {*} value
     * @param {object} object
     * @param {Jymfony.Contracts.Metadata.MetadataInterface} metadata
     * @param {string} propertyPath
     * @param {int} traversalStrategy
     * @param {Jymfony.Component.Validator.Constraints.GroupSequence} groupSequence
     * @param {null|string} cascadedGroup
     * @param {int} traversalStrategy
     * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
     *
     * @private
     */
    async _stepThroughGroupSequence(value, object, metadata, propertyPath, traversalStrategy, groupSequence, cascadedGroup, context) {
        const violationCount = context.violations.length;
        const cascadedGroups = cascadedGroup ? [ cascadedGroup ] : null;

        for (const groupInSequence of groupSequence.groups) {
            const groups = isArray(groupInSequence) ? [ ...groupInSequence ] : [ groupInSequence ];

            if (metadata instanceof ClassMetadataInterface) {
                await this._validateClassNode(
                    value,
                    metadata,
                    propertyPath,
                    groups,
                    cascadedGroups,
                    traversalStrategy,
                    context
                );
            } else {
                await this._validateGenericNode(
                    value,
                    object,
                    object,
                    metadata,
                    propertyPath,
                    groups,
                    cascadedGroups,
                    traversalStrategy,
                    context
                );
            }

            // Abort sequence validation if a violation was generated
            if (context.violations.length > violationCount) {
                break;
            }
        }
    }

    /**
     * Validates a node's value against all constraints in the given group.
     *
     * @param {*} value The validated value
     * @param {*} object The validated object
     * @param {Jymfony.Contracts.Metadata.MetadataInterface} metadata
     * @param {string} group
     * @param {Jymfony.Component.Validator.Context.ExecutionContextInterface} context
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    async _validateInGroup(value, object, metadata, group, context) {
        context.setGroup(group);

        for (const constraint of metadata.findConstraints(group)) {
            // Prevent duplicate validation of constraints, in the case that constraints belong to multiple validated groups
            if (!! object) {
                if (context.isConstraintValidated(object, constraint, group)) {
                    continue;
                }

                context.markConstraintAsValidated(object, constraint, group);
            }

            context.setConstraint(constraint);

            const validator = this._validatorFactory.getInstance(constraint);
            validator.initialize(context);

            if (value instanceof LazyProperty) {
                value = await value.getPropertyValue();
            }

            try {
                await validator.validate(value, constraint);
            } catch (e) {
                if (! (e instanceof UnexpectedValueException)) {
                    throw e;
                }

                context.buildViolation('This value should be of type {{ type }}.')
                    .setParameter('{{ type }}', e.expectedType)
                    .addViolation();
            }
        }
    }
}
