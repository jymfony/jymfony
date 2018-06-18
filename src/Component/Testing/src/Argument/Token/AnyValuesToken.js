const TokenInterface = Jymfony.Component.Testing.Argument.Token.TokenInterface;

/**
 * @memberOf Jymfony.Component.Testing.Argument.Token
 */
class AnyValuesToken extends implementationOf(TokenInterface) {
    /**
     * @inheritdoc
     */
    scoreArgument() {
        return 2;
    }

    /**
     * @inheritdoc
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
