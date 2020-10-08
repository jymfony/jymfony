const ConstraintViolationListInterface = Jymfony.Component.Validator.ConstraintViolationListInterface;

/**
 * Default implementation of {@ConstraintViolationListInterface}.
 *
 * @memberOf Jymfony.Component.Validator
 */
export default class ConstraintViolationList extends implementationOf(ConstraintViolationListInterface) {
    /**
     * Creates a new constraint violation list.
     *
     * @param {Jymfony.Component.Validator.ConstraintViolationInterface[]} violations The constraint violations to add to the list
     */
    __construct(violations = []) {
        this._violations = [];
        for (const violation of violations) {
            this.add(violation);
        }
    }

    /**
     * Converts the violation into a string for debugging purposes.
     *
     * @returns {string} The violation as string
     */
    toString() {
        return this._violations.map(String).join('\n');
    }

    /**
     * @inheritdoc
     */
    add(violation) {
        this._violations.push(violation);
    }

    /**
     * @inheritdoc
     */
    addAll(otherList) {
        for (const violation of otherList) {
            this.add(violation);
        }
    }

    /**
     * @inheritdoc
     */
    get(offset) {
        if (undefined === this._violations[offset]) {
            throw new OutOfBoundsException(__jymfony.sprintf('The offset "%s" does not exist.', offset));
        }

        return this._violations[offset];
    }

    /**
     * @inheritdoc
     */
    has(offset) {
        return undefined !== this._violations[offset];
    }

    /**
     * @inheritdoc
     */
    set(offset, violation) {
        this._violations[offset] = violation;
    }

    /**
     * @inheritdoc
     */
    remove(offset) {
        delete this._violations[offset];
    }

    * [Symbol.iterator]() {
        yield * this._violations;
    }

    /**
     * @returns {int}
     */
    get length() {
        return this._violations.length;
    }

    /**
     * Creates iterator for errors with specific codes.
     *
     * @param {string|string[]} codes The codes to find
     *
     * @returns {Jymfony.Component.Validator.ConstraintViolationList} new instance which contains only specific errors
     */
    findByCodes(codes) {
        codes = isArray(codes) ? codes : [ codes ];
        const violations = [];
        for (const violation of this) {
            if (codes.includes(violation.code)) {
                violations.push(violation);
            }
        }

        return new ConstraintViolationList(violations);
    }
}
