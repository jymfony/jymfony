const TokenInterface = Jymfony.Component.Testing.Argument.Token.TokenInterface;
const builtinTypes = [ 'undefined', 'object', 'boolean', 'number', 'bigint', 'string', 'symbol', 'function' ];

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
        if (builtinTypes.includes(this._type)) {
            return typeof argument === this._type ? 5 : false;
        }

        if (isString(this._type)) {
            this._type = new ReflectionClass(this._type).getConstructor();
        }

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
        const type = isString(this._type) ? this._type : new ReflectionClass(this._type).name;

        return __jymfony.sprintf('type(%s)', type);
    }
}
