const TokenInterface = Jymfony.Component.Testing.Argument.Token.TokenInterface;
const InvalidArgumentException = Jymfony.Component.Testing.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.Component.Testing.Argument.Token
 */
export default class CallbackToken extends implementationOf(TokenInterface) {
    /**
     * Constructor.
     *
     * @param {Function} callback
     */
    __construct(callback) {
        if (! isFunction(callback)) {
            throw new InvalidArgumentException(
                __jymfony.sprintf('Function expected for CallbackToken, but got %s', typeof callback)
            );
        }

        /**
         * @type {Function}
         *
         * @private
         */
        this._callback = callback;
    }

    /**
     * @inheritdoc
     */
    scoreArgument(argument) {
        return this._callback.call(undefined, argument) ? 7 : false;
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
        return 'callback()';
    }
}
