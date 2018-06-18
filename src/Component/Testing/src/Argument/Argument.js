const Token = Jymfony.Component.Testing.Argument.Token;

/**
 * @memberOf Jymfony.Component.Testing.Argument
 */
class Argument {
    /**
     * @param {*} value
     *
     * @returns {Jymfony.Component.Testing.Argument.Token.ExactValueToken}
     */
    static exact(value) {
        return new Token.ExactValueToken(value);
    }

    /**
     * @param {*} type
     *
     * @returns {Jymfony.Component.Testing.Argument.Token.TypeToken}
     */
    static type(type) {
        return new Token.TypeToken(type);
    }

    /**
     * @param {Function} callback
     *
     * @returns {Jymfony.Component.Testing.Argument.Token.CallbackToken}
     */
    static that(callback) {
        return new Token.CallbackToken(callback);
    }

    /**
     * @returns {Jymfony.Component.Testing.Argument.Token.AnyValueToken}
     */
    static any() {
        return new Token.AnyValueToken();
    }

    /**
     * @returns {Jymfony.Component.Testing.Argument.Token.AnyValuesToken}
     */
    static cetera() {
        return new Token.AnyValuesToken();
    }

    /**
     * @param {*} value
     *
     * @returns {Jymfony.Component.Testing.Argument.Token.IdenticalValueToken}
     */
    static identical(value) {
        return new Token.IdenticalValueToken(value);
    }

    /**
     * @param {number} value
     * @param {int} [precision = 0]
     *
     * @returns {Jymfony.Component.Testing.Argument.Token.ApproximateValueToken}
     */
    static approximate(value, precision = 0) {
        return new Token.ApproximateValueToken(value, precision);
    }
}

module.exports = Argument;
