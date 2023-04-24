const Constraint = Jymfony.Component.Testing.Constraints.Constraint;

/**
 * Constraint that asserts that the value it is evaluated for is of a
 * specified type.
 *
 * The expected value is passed in the constructor.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 * @final
 */
export default class IsType extends Constraint {
    /**
     * Constructor.
     *
     * @param {string} type
     */
    __construct(type) {
        if (! KNOWN_TYPES[type]) {
            throw new InvalidArgumentException(__jymfony.sprintf('Type specified for Jymfony.Component.Testing.Constraints.IsType <%s> is not a valid type.', type));
        }

        /**
         * @type {string}
         *
         * @private
         */
        this._type = type;
    }

    /**
     * Returns a string representation of the constraint.
     */
    toString() {
        return __jymfony.sprintf('is of type "%s"', this._type);
    }

    /**
     * @inheritdoc
     */
    matches(other) {
        switch (this._type) {
            case 'numeric':
                return isNumeric(other);

            case 'number':
            case 'string':
            case 'undefined':
            case 'bigint':
            case 'symbol':
            case 'function':
                return typeof other === this._type;

            case 'boolean':
            case 'bool':
                return isBoolean(other);

            case 'null':
                return null === other;

            case 'array':
                return isArray(other);

            case 'object':
                return isObject(other);

            case 'scalar':
                return isScalar(other);

            case 'promise':
                return isPromise(other);
        }
    }
}

Object.defineProperty(IsType, 'TYPE_UNDEFINED', { value: 'undefined', writable: false, configurable: false });
Object.defineProperty(IsType, 'TYPE_BOOLEAN', { value: 'boolean', writable: false, configurable: false });
Object.defineProperty(IsType, 'TYPE_BOOL', { value: 'bool', writable: false, configurable: false });
Object.defineProperty(IsType, 'TYPE_NUMBER', { value: 'number', writable: false, configurable: false });
Object.defineProperty(IsType, 'TYPE_BIGINT', { value: 'bigint', writable: false, configurable: false });
Object.defineProperty(IsType, 'TYPE_STRING', { value: 'string', writable: false, configurable: false });
Object.defineProperty(IsType, 'TYPE_SYMBOL', { value: 'symbol', writable: false, configurable: false });
Object.defineProperty(IsType, 'TYPE_FUNCTION', { value: 'function', writable: false, configurable: false });
Object.defineProperty(IsType, 'TYPE_OBJECT', { value: 'object', writable: false, configurable: false });
Object.defineProperty(IsType, 'TYPE_NUMERIC', { value: 'numeric', writable: false, configurable: false });
Object.defineProperty(IsType, 'TYPE_ARRAY', { value: 'array', writable: false, configurable: false });
Object.defineProperty(IsType, 'TYPE_NULL', { value: 'null', writable: false, configurable: false });
Object.defineProperty(IsType, 'TYPE_SCALAR', { value: 'scalar', writable: false, configurable: false });
Object.defineProperty(IsType, 'TYPE_PROMISE', { value: 'promise', writable: false, configurable: false });

const KNOWN_TYPES = {
    [IsType.TYPE_UNDEFINED]: true,
    [IsType.TYPE_BOOLEAN]: true,
    [IsType.TYPE_BOOL]: true,
    [IsType.TYPE_NUMBER]: true,
    [IsType.TYPE_BIGINT]: true,
    [IsType.TYPE_STRING]: true,
    [IsType.TYPE_SYMBOL]: true,
    [IsType.TYPE_FUNCTION]: true,
    [IsType.TYPE_OBJECT]: true,
    [IsType.TYPE_NUMERIC]: true,
    [IsType.TYPE_ARRAY]: true,
    [IsType.TYPE_NULL]: true,
    [IsType.TYPE_SCALAR]: true,
    [IsType.TYPE_PROMISE]: true,
};
