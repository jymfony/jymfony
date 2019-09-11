/**
 * @memberOf Jymfony.Component.Testing.Argument.Token
 */
class TokenInterface {
    /**
     * Calculates token match score for provided argument.
     *
     * @param {*} argument
     *
     * @returns {boolean|int}
     */
    scoreArgument(argument) { }

    /**
     * Returns true if this token prevents check of other tokens (is last one).
     *
     * @returns {boolean|int}
     */
    isLast() { }

    /**
     * Returns string representation for token.
     *
     * @returns {string}
     */
    toString() { }
}

export default getInterface(TokenInterface);
