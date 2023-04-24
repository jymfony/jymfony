const Constraint = Jymfony.Component.Testing.Constraints.Constraint;

/**
 * Constraint that asserts that the string it is evaluated for matches
 * a regular expression.
 *
 * The pattern string passed in the constructor.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 */
export default class RegularExpression extends Constraint {
    /**
     * Constructor.
     *
     * @param {RegExp} regex
     */
    __construct(regex) {
        /**
         * @type {RegExp}
         *
         * @private
         */
        this._regex = regex;
    }

    /**
     * @inheritdoc
     */
    toString() {
        return __jymfony.sprintf('matches pattern "%s"', this._regex.toString());
    }

    /**
     * @inheritdoc
     */
    matches(other) {
        return this._regex.test(other);
    }
}
