const Constraint = Jymfony.Component.Testing.Constraints.Constraint;
const InvalidArgumentException = Jymfony.Component.Testing.Exception.InvalidArgumentException;

/**
 * Logical AND.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 * @final
 */
export default class LogicalAnd extends Constraint {
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

        for (const constraint of constraints) {
            if (! (constraint instanceof Constraint)) {
                throw new InvalidArgumentException(__jymfony.sprintf('All parameters to %s must be a constraint object.', ReflectionClass.getClassName(this)));
            }

            this._constraints.push(constraint);
        }
    }

    /**
     * @inheritdoc
     */
    evaluate(other, description = '', returnResult = false) {
        let success = true;

        for (const constraint of this._constraints) {
            if (! constraint.evaluate(other, description, true)) {
                success = false;

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
                text += ' and ';
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
