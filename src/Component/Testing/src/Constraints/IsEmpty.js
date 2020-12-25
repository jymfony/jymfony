const Constraint = Jymfony.Component.Testing.Constraints.Constraint;
const empty = value => ! value || ((isObjectLiteral(value) || isArray(value)) && 0 === Object.keys(value).length);

/**
 * Constraint that checks whether a variable is empty.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 */
export default class IsEmpty extends Constraint {
    /**
     * @inheritdoc
     */
    toString() {
        return 'is empty';
    }

    /**
     * @inheritdoc
     */
    matches(other) {
        if (undefined === other.length && other[Symbol.iterator]) {
            other = [ ...other ];
        }

        if (undefined !== other.length) {
            return 0 === other.length;
        }

        return empty(other);
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
        const type = typeof other;

        return __jymfony.sprintf(
            '%s %s %s',
            type.startsWith('a') || type.startsWith('o') ? 'an' : 'a',
            type,
            this.toString()
        );
    }
}
