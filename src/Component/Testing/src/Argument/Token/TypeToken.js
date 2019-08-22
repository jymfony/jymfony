const TokenInterface = Jymfony.Component.Testing.Argument.Token.TokenInterface;

/**
 * @memberOf Jymfony.Component.Testing.Argument.Token
 */
export default class TypeToken extends implementationOf(TokenInterface) {
    /**
     * Constructor.
     *
     * @param {*} type
     */
    __construct(type) {
        this._type = type;
    }

    /**
     * @inheritdoc
     */
    scoreArgument(argument) {
        return argument instanceof this._type ? 5 : false;
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
        return __jymfony.sprintf('type(%s)', this._type);
    }
}
