declare namespace Jymfony.Component.Validator.Validator {
    import ClassMetadataInterface = Jymfony.Component.Validator.Mapping.ClassMetadataInterface;
    import Constraint = Jymfony.Component.Validator.Constraint;
    import ContextualValidatorInterface = Jymfony.Component.Validator.Validator.ContextualValidatorInterface;
    import ExecutionContextInterface = Jymfony.Component.Validator.Context.ExecutionContextInterface;
    import GroupSequence = Jymfony.Component.Validator.Constraints.GroupSequence;
    import MetadataFactoryInterface = Jymfony.Contracts.Metadata.MetadataFactoryInterface;
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

    /**
     * Recursive implementation of {@link ContextualValidatorInterface}.
     */
    export class RecursiveContextualValidator extends implementationOf(ContextualValidatorInterface) {
        private _context: ExecutionContextInterface;
        private _defaultPropertyPath: string;
        private _defaultGroups: string[];
        private _metadataFactory: MetadataFactoryInterface<ClassMetadataInterface>;
        private _validatorFactory: ConstraintValidatorFactoryInterface;

        /**
         * Creates a validator for the given context.
         */
        __construct(context: ExecutionContextInterface, metadataFactory: MetadataFactoryInterface<ClassMetadataInterface>, validatorFactory: ConstraintValidatorFactoryInterface): void;
        constructor(context: ExecutionContextInterface, metadataFactory: MetadataFactoryInterface<ClassMetadataInterface>, validatorFactory: ConstraintValidatorFactoryInterface);

        /**
         * @inheritdoc
         */
        atPath(path: string): this;

        /**
         * @inheritdoc
         */
        validate(value: any, constraints?: Constraint | Constraint[], groups?: GroupsType): Promise<ContextualValidatorInterface>;

        /**
         * @inheritdoc
         */
        validateProperty(object: object, propertyName: string, groups?: GroupsType): Promise<ContextualValidatorInterface>;

        /**
         * @inheritdoc
         */
        validatePropertyValue(objectOrClass: string | object, propertyName: string, value: any, groups?: GroupsType): Promise<ContextualValidatorInterface>;

        /**
         * @inheritdoc
         */
        public readonly violations: ConstraintViolationListInterface;

        /**
         * Normalizes the given group or list of groups to an array.
         *
         * @param groups The groups to normalize
         *
         * @returns A group array
         */
        protected _normalizeGroups(groups: GroupsType): (string | GroupSequence)[];

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
         */
        private _validateObject(object: object, propertyPath: string, groups: (string | GroupSequence)[], traversalStrategy: number, context: ExecutionContextInterface): Promise<void>;

        /**
         * Validates each object in a collection against the constraints defined
         * for their classes.
         *
         * Nested arrays are also iterated.
         */
        private _validateEachObjectIn(collection: any[] | Record<any, any>, propertyPath: string, groups: (string | GroupSequence)[], context: ExecutionContextInterface): Promise<void>;

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
         * @throws {Jymfony.Component.Validator.Exception.UnsupportedMetadataException}
         *              If a property metadata does not implement
         *              {@link Jymfony.Component.Validator.Mapping.PropertyMetadataInterface}
         * @throws {Jymfony.Component.Validator.Exception.ConstraintDefinitionException}
         *              If traversal was enabled but the object is not traversable.
         *
         * @see Jymfony.Component.Validator.Mapping.TraversalStrategy
         */
        private _validateClassNode(object: object, metadata: ClassMetadataInterface, propertyPath: string, groups: (string | GroupSequence)[], cascadedGroups: string[], traversalStrategy: number, context: ExecutionContextInterface): Promise<void>;

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
         * @see TraversalStrategy
         */
        private _validateGenericNode(value: any, object: object, cacheObject: object | null, metadata: MetadataInterface, propertyPath: string, groups: (string | GroupSequence)[], cascadedGroups: string[], traversalStrategy: number, context: ExecutionContextInterface): Promise<void>;

        /**
         * Sequentially validates a node's value in each group of a group sequence.
         *
         * If any of the constraints generates a violation, subsequent groups in the
         * group sequence are skipped.
         */
        private _stepThroughGroupSequence(value: any, object: object, metadata: MetadataInterface, propertyPath: string, traversalStrategy: number, groupSequence: GroupSequence, cascadedGroup: string | null, context: ExecutionContextInterface): Promise<void>;

        /**
         * Validates a node's value against all constraints in the given group.
         */
        private _validateInGroup(value: any, object: object, metadata: MetadataInterface, group: string, context: ExecutionContextInterface): Promise<void>;
    }
}
