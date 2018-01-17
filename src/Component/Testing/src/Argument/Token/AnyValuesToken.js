const TokenInterface = Jymfony.Component.Testing.Argument.Token.TokenInterface;

/**
 * @memberOf Jymfony.Component.Testing.Argument.Token
 */
class AnyValuesToken extends implementationOf(TokenInterface) {
    /**
     * @inheritDoc
     */
    scoreArgument() {
        return 2;
    }

    /**
     * @inheritDoc
     */
    isLast() {
        return true;
    }

    /**
     * Returns string representation for token.
     *
     * @returns {string}
     */
    toString() {
        return '* [, ...]';
    }
}

module.exports = AnyValuesToken;
