const TokenInterface = Jymfony.Component.Testing.Argument.Token.TokenInterface;

/**
 * @memberOf Jymfony.Component.Testing.Argument.Token
 */
class IdenticalValueToken extends implementationOf(TokenInterface) {
    /**
     * Constructor.
     *
     * @param {*} value
     */
    __construct(value) {
        this._value = value;
    }

    /**
     * @inheritdoc
     */
    scoreArgument(argument) {
        return __jymfony.equal(argument, this._value, true) ? 11 : false;
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
        return __jymfony.sprintf('identical(%s)', JSON.stringify(this._value));
    }
}

module.exports = IdenticalValueToken;
