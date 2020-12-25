const ComparatorFactory = Jymfony.Component.Testing.Comparator.ComparatorFactory;
const ComparisonFailure = Jymfony.Component.Testing.Comparator.ComparisonFailure;
const Constraint = Jymfony.Component.Testing.Constraints.Constraint;
const ExpectationFailedException = Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException;

/**
 * Constraint that checks if one value is equal to another.
 *
 * Equality is checked with == operator.
 * Two values are equal if they have the same value disregarding type.
 *
 * The expected value is passed in the constructor.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 * @final
 */
export default class IsEqual extends Constraint {
    /**
     *
     * @param {*} value
     * @param {number} [delta = .0]
     * @param {boolean} [ignoreCase = false]
     */
    __construct(value, delta = .0, ignoreCase = false) {
        /**
         * @type {*}
         *
         * @private
         */
        this._value = value;

        /**
         * @type {number}
         *
         * @private
         */
        this._delta = delta;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._ignoreCase = ignoreCase;

        /**
         * @type {Jymfony.Component.Testing.Comparator.ComparatorFactory}
         *
         * @private
         */
        this._comparatorFactory = undefined;
    }

    get comparatorFactory() {
        if (undefined === this._comparatorFactory) {
            this._comparatorFactory = new ComparatorFactory();
        }

        return this._comparatorFactory;
    }

    set comparatorFactory(factory) {
        this._comparatorFactory = factory;
    }

    /**
     * @inheritdoc
     */
    evaluate(other, description = '', Throw = true) {
        // If this._value and other are identical, they are also equal.
        // This is the most common path and will allow us to skip
        // Initialization of all the comparators.
        if (this._value === other) {
            return true;
        }

        try {
            const comparator = this.comparatorFactory.getComparatorFor(this._value, other);
            comparator.assertEquals(
                this._value,
                other,
                this._delta,
                this._ignoreCase
            );
        } catch (f) {
            if (! (f instanceof ComparisonFailure)) {
                throw f;
            }

            if (! Throw) {
                return false;
            }

            throw new ExpectationFailedException(__jymfony.trim(description + '\n' + f.message), f);
        }

        return true;
    }

    /**
     * Returns a string representation of the constraint.
     */
    toString() {
        let delta = '';

        if (isString(this._value)) {
            if (this._value.includes('\n')) {
                return 'is equal to <text>';
            }

            return __jymfony.sprintf('is equal to \'%s\'', this._value);
        }

        if (0 !== this._delta) {
            delta = __jymfony.sprintf(' with delta <%F>', this._delta);
        }

        return __jymfony.sprintf('is equal to %s%s', this.shortenedExport(this._value), delta);
    }
}
