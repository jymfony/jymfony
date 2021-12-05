const Constraint = Jymfony.Component.Testing.Constraints.Constraint;
const LogicalAnd = Jymfony.Component.Testing.Constraints.LogicalAnd;
const LogicalOr = Jymfony.Component.Testing.Constraints.LogicalOr;
const IsEqual = Jymfony.Component.Testing.Constraints.IsEqual;

/**
 * Logical NOT.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 * @final
 */
export default class LogicalNot extends Constraint {
    static negate(string) {
        const replacePairs = {
            'contains ': 'does not contain ',
            'exists': 'does not exist',
            'has ': 'does not have ',
            'is ': 'is not ',
            'are ': 'are not ',
            'matches ': 'does not match ',
            'starts with ': 'starts not with ',
            'ends with ': 'ends not with ',
            'reference ': 'don\'t reference ',
            'not not ': 'not ',
        };

        let negatedString;
        const matches = string.match(/('[\w\W]*')([\w\W]*)("[\w\W]*")/i);
        if (matches) {
            const replacement = __jymfony.strtr(matches[2], replacePairs);
            const nonInput = new RegExp(matches[2], 'g');
            negatedString = string.replace(nonInput, replacement);
        } else {
            negatedString = __jymfony.strtr(string, replacePairs);
        }

        return negatedString;
    }

    /**
     * @param {Jymfony.Component.Testing.Constraints.Constraint|*} constraint
     */
    __construct(constraint) {
        if (! (constraint instanceof Constraint)) {
            constraint = new IsEqual(constraint);
        }

        /**
         * @type {Jymfony.Component.Testing.Constraints.Constraint}
         *
         * @private
         */
        this._constraint = constraint;
    }

    /**
     * @inheritdoc
     */
    evaluate(other, description = '', Throw = true) {
        const success = ! this._constraint.evaluate(other, description, false);
        if (! Throw) {
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
        switch (ReflectionClass.getClassName(this._constraint)) {
            case ReflectionClass.getClassName(LogicalAnd):
            case ReflectionClass.getClassName(LogicalNot):
            case ReflectionClass.getClassName(LogicalOr):
                return 'not( ' + this._constraint.toString() + ' )';

            default:
                return __self.negate(this._constraint.toString());
        }
    }

    /**
     * Counts the number of constraint elements.
     */
    get length() {
        return this._constraint.length;
    }

    /**
     * @inheritdoc
     */
    _failureDescription(other) {
        switch (ReflectionClass.getClassName(this._constraint)) {
            case ReflectionClass.getClassName(LogicalAnd):
            case ReflectionClass.getClassName(LogicalNot):
            case ReflectionClass.getClassName(LogicalOr):
                return 'not( ' + this._constraint._failureDescription(other) + ' )';

            default:
                return __self.negate(this._constraint._failureDescription(other));
        }
    }
}
