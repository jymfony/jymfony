const TokenInterface = Jymfony.Component.Testing.Argument.Token.TokenInterface;
const builtinTypes = [ 'undefined', 'object', 'boolean', 'number', 'bigint', 'string', 'symbol', 'function' ];

/**
 * @memberOf Jymfony.Component.Testing.Argument.Token
 */
export default class TypeToken extends implementationOf(TokenInterface) {
    _type;

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

        return new ReflectionClass(argument).isInstanceOf(this._type) ? 5 : false;
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
        let type;

        if (isString(this._type)) {
            type = this._type;
        } else if (isFunction(this._type)) {
            type = this._type.name;

            try {
                type = new ReflectionClass(this._type).name || type;
            } catch {
                // Do nothing.
            }
        } else {
            type = String(this._type);
        }

        return __jymfony.sprintf('type(%s)', type);
    }
}
