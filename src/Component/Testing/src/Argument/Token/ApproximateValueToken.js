const TokenInterface = Jymfony.Component.Testing.Argument.Token.TokenInterface;
const InvalidArgumentException = Jymfony.Component.Testing.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.Component.Testing.Argument.Token
 */
class ApproximateValueToken extends implementationOf(TokenInterface) {
    /**
     * Constructor.
     *
     * @param {number} value
     * @param {int} [precision = 0]
     */
    __construct(value, precision = 0) {
        if (! isNumber(value)) {
            throw new InvalidArgumentException(
                __jymfony.sprintf('Number expected for ApproximateValueToken, but got %s', typeof value)
            );
        }

        /**
         * @type {number}
         *
         * @private
         */
        this._value = value;

        /**
         * @type {int}
         *
         * @private
         */
        this._precision = ~~precision;
    }

    /**
     * @inheritdoc
     */
    scoreArgument(argument) {
        if (! isNumber(argument)) {
            return false;
        }

        return argument.toPrecision(this._precision) === this._value.toPrecision(this._precision) ? 10 : false;
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
        return '≅' + this._value.toPrecision(this._precision);
    }
}

module.exports = ApproximateValueToken;
