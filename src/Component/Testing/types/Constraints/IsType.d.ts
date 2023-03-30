declare namespace Jymfony.Component.Testing.Constraints {
    import Constraint = Jymfony.Component.Testing.Constraints.Constraint;

    /**
     * Constraint that asserts that the value it is evaluated for is of a
     * specified type.
     *
     * The expected value is passed in the constructor.
     *
     * @final
     */
    export class IsType extends Constraint {
        public static readonly TYPE_UNDEFINED: 'undefined';
        public static readonly TYPE_BOOLEAN: 'boolean';
        public static readonly TYPE_BOOL: 'bool';
        public static readonly TYPE_NUMBER: 'number';
        public static readonly TYPE_BIGINT: 'bigint';
        public static readonly TYPE_STRING: 'string';
        public static readonly TYPE_SYMBOL: 'symbol';
        public static readonly TYPE_FUNCTION: 'function';
        public static readonly TYPE_OBJECT: 'object';
        public static readonly TYPE_NUMERIC: 'numeric';
        public static readonly TYPE_ARRAY: 'array';
        public static readonly TYPE_NULL: 'null';
        public static readonly TYPE_SCALAR: 'scalar';
        public static readonly TYPE_PROMISE: 'promise';

        private _type: string;

        /**
         * Constructor.
         */
        __construct(type: string): void;
        constructor(type: string);

        /**
         * Returns a string representation of the constraint.
         */
        toString(): string;

        /**
         * @inheritdoc
         */
        matches(other: any): boolean;
    }
}
