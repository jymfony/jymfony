declare namespace Jymfony.Component.Validator.Context {
    import Constraint = Jymfony.Component.Validator.Constraint;
    import ConstraintViolationListInterface = Jymfony.Component.Validator.ConstraintViolationListInterface;
    import ConstraintViolationBuilderInterface = Jymfony.Component.Validator.Violation.ConstraintViolationBuilderInterface;
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;
    import ValidatorInterface = Jymfony.Component.Validator.Validator.ValidatorInterface;

    /**
     * The context of a validation run.
     *
     * The context collects all violations generated during the validation. By
     * default, validators execute all validations in a new context:
     *
     *     violations = validator.validate(object);
     *
     * When you make another call to the validator, while the validation is in
     * progress, the violations will be isolated from each other:
     *
     *     validate(value, constraint) {
     *         const validator = this.context.validator;
     *
     *         // The violations are not added to this.context
     *         const violations = validator.validate(value);
     *     }
     *
     * However, if you want to add the violations to the current context, use the
     * {@link Jymfony.Component.Validator.Validator.ValidatorInterface.inContext()} method:
     *
     *     validate(value, constraint) {
     *         const validator = this.context.validator;
     *
     *         // The violations are added to $this->context
     *         validator
     *             .inContext(this.context)
     *             .validate(value)
     *         ;
     *     }
     *
     * Additionally, the context provides information about the current state of
     * the validator, such as the currently validated class, the name of the
     * currently validated property and more. These values change over time, so you
     * cannot store a context and expect that the methods still return the same
     * results later on.
     */
    export class ExecutionContextInterface {
        public static readonly definition: Newable<ExecutionContextInterface>;

        /**
         * Adds a violation at the current node of the validation graph.
         *
         * @param message The error message
         * @param params The parameters substituted in the error message
         */
        addViolation(message: string, params?: Record<string, string>): void;

        /**
         * Returns a builder for adding a violation with extended information.
         *
         * Call {@link ConstraintViolationBuilderInterface::addViolation()} to
         * add the violation when you're done with the configuration:
         *
         *     $context->buildViolation('Please enter a number between %min% and %max%.')
         *         ->setParameter('%min%', 3)
         *         ->setParameter('%max%', 10)
         *         ->setTranslationDomain('number_validation')
         *         ->addViolation();
         *
         * @param message The error message
         * @param parameters The parameters substituted in the error message
         *
         * @returns The violation builder
         */
        buildViolation(message: string, parameters?: Record<string, string>): ConstraintViolationBuilderInterface;

        /**
         * Returns the validator.
         *
         * Useful if you want to validate additional constraints:
         *
         *     validate(value: any, constraint: Constraint) {
         *         const validator = this.context.validator;
         *         const violations = validator.validate(value, new Length({min: 3}));
         *
         *         if (violations.length > 0) {
         *             // ...
         *         }
         *     }
         */
        public readonly validator: ValidatorInterface;

        /**
         * Returns the currently validated object.
         *
         * If the validator is currently validating a class constraint, the
         * object of that class is returned. If it is validating a property or
         * getter constraint, the object that the property/getter belongs to is
         * returned.
         *
         * In other cases, null is returned.
         *
         * @returns The currently validated object or null
         */
        public readonly object: any | null;

        /**
         * Sets the currently validated value.
         *
         * @param value The validated value
         * @param object The currently validated object
         * @param metadata The validation metadata
         * @param propertyPath The property path to the current value
         *
         * @internal Used by the validator engine. Should not be called by user code.
         */
        setNode(value: any, object: object | null, metadata: MetadataInterface | null, propertyPath: string): void;

        /**
         * Sets the currently validated group.
         *
         * @param group The validated group
         *
         * @internal Used by the validator engine. Should not be called by user code.
         */
        setGroup(group: string | null): void;

        /**
         * Sets the currently validated constraint.
         *
         * @param constraint The validated constraint
         *
         * @internal Used by the validator engine. Should not be called by user code.
         */
        setConstraint(constraint: Constraint): void;

        /**
         * Marks an object as validated in a specific validation group.
         *
         * @param object The validated object
         * @param groupHash The group's name or hash, if it is group sequence
         *
         * @internal Used by the validator engine. Should not be called by user code.
         */
        markGroupAsValidated(object: object, groupHash: string): void;

        /**
         * Returns whether an object was validated in a specific validation group.
         *
         * @param object The validated object
         * @param groupHash The group's name or hash, if it is group sequence
         *
         * @returns Whether the object was already validated for that group
         *
         * @internal Used by the validator engine. Should not be called by user code.
         */
        isGroupValidated(object: object, groupHash: string): boolean

        /**
         * Marks a constraint as validated for an object.
         *
         * @param {object} object The validated object
         * @param {*} constraint The constraint
         * @param {string} group The validated group
         *
         * @internal Used by the validator engine. Should not be called by user code.
         */
        markConstraintAsValidated(object: object, constraint: Constraint, group: string): void;

        /**
         * Returns whether a constraint was validated for an object.
         *
         * @param {object} object The validated object
         * @param {*} constraint The constraint
         * @param {string} group The validated group
         *
         * @returns {boolean} Whether the constraint was already validated
         *
         * @internal Used by the validator engine. Should not be called by user code.
         */
        isConstraintValidated(object: object, constraint: Constraint, group: string): boolean

        /**
         * Returns the violations generated by the validator so far.
         *
         * @returns The constraint violation list
         */
        public readonly violations: ConstraintViolationListInterface;

        /**
         * Returns the value at which validation was started in the object graph.
         *
         * The validator, when given an object, traverses the properties and
         * related objects and their properties. The root of the validation is the
         * object from which the traversal started.
         *
         * The current value is returned by {@link getValue}.
         *
         * @returns The root value of the validation
         */
        public readonly root: any;

        /**
         * Returns the value that the validator is currently validating.
         *
         * If you want to retrieve the object that was originally passed to the
         * validator, use {@link root}.
         *
         * @returns The currently validated value
         */
        public readonly value: any;

        /**
         * Returns the metadata for the currently validated value.
         *
         * With the core implementation, this method returns a
         * {@link Mapping.ClassMetadataInterface} instance if the current value is an object,
         * a {@link Mapping.PropertyMetadata} instance if the current value is
         * the value of a property and a {@link Mapping.GetterMetadata} instance if
         * the validated value is the result of a getter method.
         *
         * If the validated value is neither of these, for example if the validator
         * has been called with a plain value and constraint, this method returns
         * null.
         *
         * @returns the metadata of the currently validated value
         */
        public readonly metadata: MetadataInterface | null;

        /**
         * Returns the validation group that is currently being validated.
         *
         * @returns The current validation group
         */
        public readonly group: string;

        /**
         * Returns the class name of the current node.
         *
         * If the metadata of the current node does not implement
         * {@link Mapping.ClassMetadataInterface} or if no metadata is available for the
         * current node, this method returns null.
         *
         * @returns The class name or null, if no class name could be found
         */
        public readonly className: string | null;

        /**
         * Returns the property name of the current node.
         *
         * If the metadata of the current node does not implement
         * {@link PropertyMetadataInterface} or if no metadata is available for the
         * current node, this method returns null.
         *
         * @returns The property name or null, if no property name could be found
         */
        public readonly propertyName: string | null;

        /**
         * Returns the property path to the value that the validator is currently
         * validating.
         *
         * For example, take the following object graph:
         *
         * <pre>
         * (Person)---(address: Address)---(street: string)
         * </pre>
         *
         * When the <tt>Person</tt> instance is passed to the validator, the
         * property path is initially empty. When the <tt>address</tt> property
         * of that person is validated, the property path is "address". When
         * the <tt>street</tt> property of the related <tt>Address</tt> instance
         * is validated, the property path is "address.street".
         *
         * @param {string} [subPath = ''] The suffix appended to the current property path.
         *
         * @returns {string} The current property path. The result may be an empty
         *                   string if the validator is currently validating the
         *                   root value of the validation graph.
         */
        getPropertyPath(subPath?: string): string;
    }
}
