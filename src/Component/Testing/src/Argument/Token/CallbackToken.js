const TokenInterface = Jymfony.Component.Testing.Argument.Token.TokenInterface;
const InvalidArgumentException = Jymfony.Component.Testing.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.Component.Testing.Argument.Token
 */
class CallbackToken extends implementationOf(TokenInterface) {
    __construct(callback) {
        if (! isFunction(callback)) {
            throw new InvalidArgumentException(
                __jymfony.sprintf('Function expected for CallbackToken, but got %s', typeof callback)
            );
        }

        /**
         * @type {Function}
         * @private
         */
        this._callback = callback;
    }

    /**
     * @inheritDoc
     */
    scoreArgument(argument) {
        return this._callback.call(undefined, argument) ? 7 : false;
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
        return 'callback()';
    }
}

module.exports = CallbackToken;
