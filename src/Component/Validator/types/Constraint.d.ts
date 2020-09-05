declare namespace Jymfony.Component.Validator {
    type NonFunctionWritablePublicKeys<T> = Pick<T, WritableKeys<T>>
    export type ConstraintOptions<T> = Partial<
        NonFunctionWritablePublicKeys<NonFunctionProperties<T>>
    & { payload: any, groups: string[] }>;

    /**
     * Contains the properties of a constraint definition.
     *
     * A constraint can be defined on a class, a property or a getter method.
     * The Constraint class encapsulates all the configuration required for
     * validating this class, property or getter result successfully.
     *
     * Constraint instances are immutable and serializable.
     */
    export abstract class Constraint {
        /**
         * The name of the group given to all constraints with no explicit group.
         */
        static readonly DEFAULT_GROUP: string;

        /**
         * Marks a constraint that can be put onto classes.
         */
        static readonly CLASS_CONSTRAINT: string;

        /**
         * Marks a constraint that can be put onto properties.
         */
        static readonly PROPERTY_CONSTRAINT: string;

        /**
         * Domain-specific data attached to a constraint.
         */
        public payload: null;
        private _groups: null | string[];

        /**
         * Returns the name of the given error code.
         *
         * @param errorCode The error code
         *
         * @returns The name of the error code
         *
         * @throws {Jymfony.Component.Validator.Exception.InvalidArgumentException} If the error code does not exist
         */
        static getErrorName(errorCode: string): string;

        /**
         * Initializes the constraint with options.
         *
         * You should pass an object. The keys should be the names of
         * existing properties in this class. The values should be the value for these
         * properties.
         *
         * Alternatively you can override the method defaultOption to return the
         * name of an existing property. If no object is passed, this
         * property is set instead.
         *
         * You can force that certain options are set by overriding
         * requiredOptions to return the names of these options. If any
         * option is not set here, an exception is thrown.
         *
         * @param options The options (as object) or the value for the default option (any other type)
         *
         * @throws {Jymfony.Component.Validator.Exception.InvalidOptionsException} When you pass the names of non-existing options
         * @throws {Jymfony.Component.Validator.Exception.MissingOptionsException} When you don't pass any of the options returned by requiredOptions
         * @throws {Jymfony.Component.Validator.Exception.ConstraintDefinitionException} When you don't pass an object, but defaultOption returns null
         */
        __construct(options?: any | null): this;
        constructor(options?: any | null);

        /**
         * The constraint groups.
         */
        public groups: null | string[];

        /**
         * Adds the given group if this constraint is in the Default group.
         */
        addImplicitGroupName(group: string): void;

        /**
         * Returns the name of the default option.
         *
         * Override this method to define a default option.
         *
         * @see __construct()
         */
        public readonly defaultOption: string | null;

        /**
         * Returns the name of the required options.
         *
         * Override this method if you want to define required options.
         *
         * @see __construct()
         */
        public readonly requiredOptions: string[];

        /**
         * Returns the name of the class that validates this constraint.
         *
         * By default, this is the fully qualified name of the constraint class
         * suffixed with "Validator". You can override this method to change that
         * behavior.
         */
        public readonly validatedBy: string;

        /**
         * Returns whether the constraint can be put onto classes, properties or
         * both.
         *
         * This method should return one or more of the constants
         * Constraint.CLASS_CONSTRAINT and Constraint.PROPERTY_CONSTRAINT.
         *
         * @returns One or more constant values
         */
        public readonly targets: string | string[];

        /**
         * Optimizes the serialized value to minimize storage space.
         *
         * @returns The properties to serialize
         *
         * @internal
         */
        __sleep(): string[];

        /**
         * Wakes up from serialization.
         *
         * @internal
         */
        __wakeup(): this;
    }
}
