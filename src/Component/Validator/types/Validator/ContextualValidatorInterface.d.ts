declare namespace Jymfony.Component.Validator.Validator {
    /**
     * A validator in a specific execution context.
     */
    export class ContextualValidatorInterface {
        /**
         * Appends the given path to the property path of the context.
         *
         * If called multiple times, the path will always be reset to the context's
         * original path with the given path appended to it.
         *
         * @param {string} path The path to append
         *
         * @returns {}
         */
        atPath(path: string): ContextualValidatorInterface;

        /**
         * Validates a value against a constraint or a list of constraints.
         *
         * If no constraint is passed, the constraint
         * {@link Jymfony.Component.Validator.Constraints.Valid} is assumed.
         *
         * @param value The value to validate
         * @param [constraints] The constraint(s) to validate against
         * @param [groups] The validation groups to validate. If none is given, "Default" is assumed
         */
        validate(value: any, constraints?: Constraint | Constraint[], groups?: GroupsType): Promise<ContextualValidatorInterface>;

        /**
         * Validates a property of an object against the constraints specified
         * for this property.
         *
         * @param object The object
         * @param propertyName The name of the validated property
         * @param [groups] The validation groups to validate. If none is given, "Default" is assumed
         */
        validateProperty(object: object, propertyName: string, groups?: GroupsType): Promise<ContextualValidatorInterface>;

        /**
         * Validates a value against the constraints specified for an object's
         * property.
         *
         * @param objectOrClass The object or its class name
         * @param propertyName The name of the property
         * @param value The value to validate against the property's constraints
         * @param [groups] The validation groups to validate. If none is given, "Default" is assumed
         */
        validatePropertyValue(objectOrClass: string | object, propertyName: string, value: any, groups?: GroupsType): Promise<ContextualValidatorInterface>;

        /**
         * Returns the violations that have been generated so far in the context
         * of the validator.
         *
         * @returns The constraint violations
         */
        public readonly violations: ConstraintViolationListInterface;
    }
}
