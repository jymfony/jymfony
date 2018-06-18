const TokenInterface = Jymfony.Component.Testing.Argument.Token.TokenInterface;
const StringUtil = Jymfony.Component.Testing.Util.StringUtil;

/**
 * @memberOf Jymfony.Component.Testing.Argument.Token
 */
class ExactValueToken extends implementationOf(TokenInterface) {
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
        return __jymfony.equal(argument, this._value, false) ? 10 : false;
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
        return __jymfony.sprintf('exact(%s)', StringUtil.stringify(this._value));
    }
}

module.exports = ExactValueToken;
