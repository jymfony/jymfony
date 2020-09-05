declare namespace Jymfony.Component.Validator {
    import DateTime = Jymfony.Component.DateTime.DateTime;
    import DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;
    import ExecutionContextInterface = Jymfony.Component.Validator.Context.ExecutionContextInterface;

    /**
     * Base class for constraint validators.
     */
    export abstract class ConstraintValidator extends implementationOf(ConstraintValidatorInterface) {
        /**
         * Whether to format {@link Jymfony.Component.DateTime.DateTime} objects as RFC-3339 dates ("Y-m-d H:i:s").
         */
        public static readonly PRETTY_DATE: number;

        /**
         * Whether to cast objects with a "toString()" method to strings.
         */
        public static readonly OBJECT_TO_STRING: number;

        private _context: ExecutionContextInterface;

        __construct(): void;
        constructor();

        /**
         * @inheritDoc
         */
        initialize(context: ExecutionContextInterface): void;

        /**
         * @inheritDoc
         */
        validate(value: any, constraint: Constraint): void | Promise<void>;

        /**
         * Returns a string representation of the type of the value.
         *
         * This method should be used if you pass the type of a value as
         * message parameter to a constraint violation. Note that such
         * parameters should usually not be included in messages aimed at
         * non-technical people.
         *
         * @param value The value to return the type of
         *
         * @returns The type of the value
         *
         * @protected
         */
        protected _formatTypeOf(value: any): string;

        /**
         * Returns a string representation of the value.
         *
         * This method returns the equivalent PHP tokens for most scalar types
         * (i.e. "false" for false, "1" for 1 etc.). Strings are always wrapped
         * in double quotes ("). Objects, arrays and resources are formatted as
         * "object", "array" and "resource". If the $format bitmask contains
         * the PRETTY_DATE bit, then {@link Jymfony.Component.DateTime.DateTime}
         * objects will be formatted as RFC-3339 dates ("Y-m-d H:i:s").
         *
         * Be careful when passing message parameters to a constraint violation
         * that (may) contain objects, arrays or resources. These parameters
         * should only be displayed for technical users. Non-technical users
         * won't know what an "object", "array" or "resource" is and will be
         * confused by the violation message.
         *
         * @param value The value to format as string
         * @param format A bitwise combination of the format constants in this class
         *
         * @returns The string representation of the passed value
         */
        protected _formatValue(value: any, format?: number): string;

        /**
         * Returns a string representation of a list of values.
         *
         * Each of the values is converted to a string using
         * {@link _formatValue()}. The values are then concatenated with commas.
         *
         * @param values A list of values
         * @param format A bitwise combination of the format constants in this class
         *
         * @returns The string representation of the value list
         *
         * @see _formatValue()
         *
         * @protected
         */
        protected _formatValues(values: any[], format?: number): string;
    }
}
