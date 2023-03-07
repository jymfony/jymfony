const Constraint = Jymfony.Component.Testing.Constraints.Constraint;

/**
 * @memberOf Jymfony.Component.Testing.Constraints
 */
export default class Count extends Constraint {
    /**
     * Constructor.
     *
     * @param {int} expected
     */
    __construct(expected) {
        /**
         * @type {int}
         *
         * @private
         */
        this._expectedCount = expected;
    }

    toString() {
        return __jymfony.sprintf(
            'count matches %d',
            this._expectedCount
        );
    }

    /**
     * Evaluates the constraint for parameter $other. Returns true if the
     * constraint is met, false otherwise.
     *
     * @throws {Exception}
     */
    matches(other) {
        return this._expectedCount === this._getCountOf(other);
    }

    /**
     * @throws {Exception}
     */
    _getCountOf(other) {
        if (other instanceof Set || other instanceof Map) {
            return other.size;
        }

        if (other instanceof EmptyIterator) {
            return 0;
        }

        if (isArray(other)) {
            return other.length;
        }

        if (isObjectLiteral(other)) {
            return [ ...Object.keys(other), ...Object.getOwnPropertySymbols(other) ].length;
        }

        while (undefined !== other[Symbol.iterator]) {
            if (isGenerator(other)) {
                break;
            }

            other = other[Symbol.iterator]();
        }

        if (isFunction(other.next)) {
            let count = 0;
            while (true) {
                const { done } = other.next();
                if (done) {
                    break;
                }

                count++;
            }

            return count;
        }

        return null;
    }

    /**
     * Returns the description of the failure.
     *
     * The beginning of failure messages is "Failed asserting that" in most
     * cases. This method should return the second part of that sentence.
     *
     * @param {*} other evaluated value or object
     */
    _failureDescription(other) {
        return __jymfony.sprintf(
            'actual size %d matches expected size %d',
            ~~this._getCountOf(other),
            this._expectedCount
        );
    }
}
