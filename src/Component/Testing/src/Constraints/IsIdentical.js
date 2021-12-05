const ComparisonFailure = Jymfony.Component.Testing.Comparator.ComparisonFailure;
const Constraint = Jymfony.Component.Testing.Constraints.Constraint;
const EPSILON = 0.0000000001;

/**
 * Constraint that asserts that one value is identical to another.
 *
 * Identical check is performed with the === operator.
 * Two values are identical if they have the same value and are of the same type.
 *
 * The expected value is passed in the constructor.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 * @final
 */
export default class IsIdentical extends Constraint {
    /**
     * Constructor.
     *
     * @param {*} value
     */
    __construct(value) {
        super.__construct();

        /**
         * @type {*}
         *
         * @private
         */
        this._value = value;
    }

    /**
     * @inheritdoc
     */
    evaluate(other, description = '', Throw = true) {
        let success;
        if (isNumber(this._value) && isNumber(other)) {
            success = (isNaN(this._value) && isNaN(other)) ||
                (this._value === Infinity && other === Infinity) ||
                (this._value === -Infinity && other === -Infinity) ||
                Math.abs(this._value - other) < EPSILON
            ;
        } else if (isArray(this._value) || isObjectLiteral(this._value) || isMap(this._value) || isSet(this._value) || isBuffer(this._value)) {
            success = __jymfony.equal(this._value, other, true);
        } else {
            success = this._value === other;
        }

        if (! Throw) {
            return success;
        }

        if (! success) {
            let f = null;

            // If both values are strings, make sure a diff is generated
            if (isString(this._value) && isString(other)) {
                f = new ComparisonFailure(
                    this._value,
                    other,
                    __jymfony.sprintf('\'%s\'', this._value),
                    __jymfony.sprintf('\'%s\'', other)
                );
            }

            if (isBuffer(this._value) && isBuffer(other)) {
                f = new ComparisonFailure(
                    this._value,
                    other,
                    __jymfony.sprintf('Buffer(%u)', this._value.length),
                    __jymfony.sprintf('Buffer(%u)', other.length)
                );
            }

            // If both values are array, make sure a diff is generated
            if ((isArray(this._value) && isArray(other)) || (isObjectLiteral(this._value) && isObjectLiteral(other))) {
                f = new ComparisonFailure(
                    this._value,
                    other,
                    this.export(this._value),
                    this.export(other)
                );
            }

            this.fail(other, description, f);
        }
    }

    /**
     * Returns a string representation of the constraint.
     */
    toString() {
        if (isObject(this._value) && ! isObjectLiteral(this._value)) {
            return __jymfony.sprintf('is identical to an object of class "%s"', ReflectionClass.getClassName(this._value));
        }

        return 'is identical to ' + this.export(this._value);
    }

    /**
     * Returns the description of the failure
     *
     * The beginning of failure messages is "Failed asserting that" in most
     * cases. This method should return the second part of that sentence.
     *
     * @param {*} other evaluated value or object
     */
    _failureDescription(other) {
        if (isString(this._value) && isString(other)) {
            return 'two strings are identical';
        }

        if (isArray(this._value) && isArray(other)) {
            return 'two arrays are identical';
        }

        if (isObjectLiteral(this._value) && isObjectLiteral(other)) {
            return 'two objects are identical';
        }

        if (isMap(this._value) && isMap(other)) {
            return 'two maps are identical';
        }

        if (isSet(this._value) && isSet(other)) {
            return 'two sets are identical';
        }

        if (isObject(this._value) && isObject(other)) {
            return 'two variables reference the same object';
        }

        return super._failureDescription(other);
    }
}
