const TokenInterface = Jymfony.Component.Testing.Argument.Token.TokenInterface;

/**
 * @memberOf Jymfony.Component.Testing.Argument.Token
 */
class AnyValueToken extends implementationOf(TokenInterface) {
    /**
     * @inheritDoc
     */
    scoreArgument(argument) {
        return 3;
    }

    /**
     * @inheritDoc
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
