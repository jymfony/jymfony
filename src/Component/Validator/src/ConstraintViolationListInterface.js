/**
 * A list of constraint violations.
 *
 * @memberOf Jymfony.Component.Validator
 */
class ConstraintViolationListInterface {
    /**
     * Adds a constraint violation to this list.
     */
    add(violation) { }

    /**
     * Merges an existing violation list into this list.
     *
     * @param {Jymfony.Component.Validator.ConstraintViolationListInterface} otherList
     */
    addAll(otherList) { }

    /**
     * Returns the violation at a given offset.
     *
     * @param {int} offset The offset of the violation
     *
     * @returns {Jymfony.Component.Validator.ConstraintViolationInterface} The violation
     *
     * @throws {OutOfBoundsException} if the offset does not exist
     */
    get(offset) { }

    /**
     * Returns whether the given offset exists.
     *
     * @param {int} offset The violation offset
     *
     * @returns {boolean} Whether the offset exists
     */
    has(offset) { }

    /**
     * Sets a violation at a given offset.
     *
     * @param {int} offset The violation offset
     * @param {Jymfony.Component.Validator.ConstraintViolationInterface} violation The violation
     */
    set(offset, violation) { }

    /**
     * Removes a violation at a given offset.
     *
     * @param {int} offset The offset to remove
     */
    remove(offset) { }

    /**
     * Get the violation list length.
     *
     * @returns {int}
     */
    get length() { }
}

export default getInterface(ConstraintViolationListInterface);
