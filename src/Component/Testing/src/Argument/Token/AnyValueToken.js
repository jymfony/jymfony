const TokenInterface = Jymfony.Component.Testing.Argument.Token.TokenInterface;

/**
 * @memberOf Jymfony.Component.Testing.Argument.Token
 */
class AnyValueToken extends implementationOf(TokenInterface) {
    /**
     * @inheritdoc
     */
    scoreArgument() {
        return 3;
    }

    /**
     * @inheritdoc
     */
    isLast() {
        return false;
    }

    /**
     * Returns string representation for token.
     *
     * @returns {string}
     */
    toString() {
        return '*';
    }
}

module.exports = AnyValueToken;
