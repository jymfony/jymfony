const Token = Jymfony.Component.Testing.Argument.Token;

/**
 * @memberOf Jymfony.Component.Testing.Argument
 */
class Argument {
    static exact(value) {
        return new Token.ExactValueToken(value);
    }

    static type(type) {
        return new Token.TypeToken(type);
    }

    static that(callback) {
        return new Token.CallbackToken(callback);
    }

    static any() {
        return new Token.AnyValueToken();
    }

    static cetera() {
        return new Token.AnyValuesToken();
    }

    static identical(value) {
        return new Token.IdenticalValueToken(value);
    }

    static approximate(value, precision = 0) {
        return new Token.ApproximateValueToken(value, precision);
    }
}

module.exports = Argument;
