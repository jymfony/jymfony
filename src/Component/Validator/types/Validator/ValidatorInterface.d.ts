declare namespace Jymfony.Component.Validator.Validator {
    import ConstraintViolationListInterface = Jymfony.Component.Validator.ConstraintViolationListInterface;
    import ExecutionContextInterface = Jymfony.Component.Validator.Context.ExecutionContextInterface;
    import GroupSequence = Jymfony.Component.Validator.Constraints.GroupSequence;
    import MetadataFactoryInterface = Jymfony.Contracts.Metadata.MetadataFactoryInterface;

    export type GroupsType = string | GroupSequence | (string | GroupSequence)[] | null;

    /**
     * Validates values against constraints.
     */
    export class ValidatorInterface extends MetadataFactoryInterface.definition {
        public static readonly definition: Newable<ValidatorInterface>;

        /**
         * Validates a value against a constraint or a list of constraints.
         *
         * If no constraint is passed, the constraint
         * {@link Jymfony.Component.Validator.Constraints.Valid} is assumed.
         *
         * @param value The value to validate
         * @param [constraints] The constraint(s) to validate against
         * @param [groups] The validation groups to validate. If none is given, "Default" is assumed
         *
         * @returns A list of constraint violations.
         *          If the list is empty, validation succeeded.
         */
        validate(value: any, constraints?: Constraint | Constraint[], groups?: GroupsType): Promise<ConstraintViolationListInterface>;

        /**
         * Validates a property of an object against the constraints specified
         * for this property.
         *
         * @param object The object
         * @param propertyName The name of the validated property
         * @param [groups] The validation groups to validate. If none is given, "Default" is assumed
         *
         * @returns A list of constraint violations.
         *          If the list is empty, validation succeeded.
         */
        validateProperty(object: object, propertyName: string, groups?: GroupsType): Promise<ConstraintViolationListInterface>;

        /**
         * Validates a value against the constraints specified for an object's
         * property.
         *
         * @param objectOrClass The object or its class name
         * @param propertyName The name of the property
         * @param value The value to validate against the property's constraints
         * @param [groups] The validation groups to validate. If none is given, "Default" is assumed
         *
         * @returns A list of constraint violations.
         *          If the list is empty, validation succeeded.
         */
        validatePropertyValue(objectOrClass: string | object, propertyName: string, value: any, groups?: GroupsType): Promise<ConstraintViolationListInterface>;

        /**
         * Starts a new validation context and returns a validator for that context.
         *
         * The returned validator collects all violations generated within its
         * context. You can access these violations with the
         * {@link ContextualValidatorInterface.violations} method.
         *
         * @returns The validator for the new context
         */
        startContext(): ContextualValidatorInterface;

        /**
         * Returns a validator in the given execution context.
         *
         * The returned validator adds all generated violations to the given
         * context.
         *
         * @returns The validator for that context
         */
        inContext(context: ExecutionContextInterface): ContextualValidatorInterface;

        /**
         * Returns the locale used in this validator session.
         */
        public readonly locale: string;
    }
}
