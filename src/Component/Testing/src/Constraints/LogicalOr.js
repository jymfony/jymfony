const Constraint = Jymfony.Component.Testing.Constraints.Constraint;
const IsEqual = Jymfony.Component.Testing.Constraints.IsEqual;

/**
 * Logical OR.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 * @final
 */
export default class LogicalOr extends Constraint {
    /**
     * @param {Jymfony.Component.Testing.Constraints.Constraint[]} constraints
     */
    static fromConstraints(...constraints) {
        const constraint = new __self();
        constraint.constraints = constraints;

        return constraint;
    }

    __construct() {
        /**
         * @type {Jymfony.Component.Testing.Constraints.Constraint[]}
         *
         * @private
         */
        this._constraints = [];
    }

    /**
     * @param {Jymfony.Component.Testing.Constraints.Constraint[]} constraints
     */
    setConstraints(constraints) {
        this._constraints = [];

        for (let constraint of constraints) {
            if (! (constraint instanceof Constraint)) {
                constraint = new IsEqual(constraint);
            }

            this._constraints.push(constraint);
        }
    }

    /**
     * @inheritdoc
     */
    evaluate(other, description = '', returnResult = false) {
        let success = false;

        for (const constraint of this._constraints) {
            if (constraint.evaluate(other, description, true)) {
                success = true;
                break;
            }
        }

        if (returnResult) {
            return success;
        }

        if (! success) {
            this.fail(other, description);
        }
    }

    /**
     * Returns a string representation of the constraint.
     */
    toString() {
        let text = '';
        for (const [ key, constraint ] of __jymfony.getEntries(this._constraints)) {
            if (0 < key) {
                text += ' or ';
            }

            text += constraint.toString();
        }

        return text;
    }

    /**
     * Counts the number of constraint elements.
     */
    get length() {
        return this._constraints.reduce((v, constraint) => v + constraint.length, 0);
    }
}
