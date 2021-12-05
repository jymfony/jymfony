const Constraint = Jymfony.Component.Testing.Constraints.Constraint;

/**
 * Constraint that asserts that the string it is evaluated for contains
 * a given string.
 *
 * Uses indexOf() to find the position of the string in the input, if not
 * found the evaluation fails.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 * @final
 */
export default class StringContains extends Constraint {
    /**
     * Constructor.
     *
     * @param {string} string
     * @param {boolean} [ignoreCase = false]
     */
    __construct(string, ignoreCase = false) {
        /**
         * @type {string}
         *
         * @private
         */
        this._string = string;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._ignoreCase = ignoreCase;
    }

    /**
     * Returns a string representation of the constraint.
     */
    toString() {
        let string;
        if (this._ignoreCase) {
            string = this._string.toLowerCase();
        } else {
            string = this._string;
        }

        return __jymfony.sprintf('contains "%s"', string);
    }

    /**
     * @inheritdoc
     */
    matches(other) {
        if ('' === this._string) {
            return true;
        }

        if (this._ignoreCase) {
            return -1 !== other.toLowerCase().indexOf(this._string.toLowerCase());
        }

        return -1 !== other.indexOf(this._string);
    }
}
