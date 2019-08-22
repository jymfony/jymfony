const Token = Jymfony.Component.Testing.Argument.Token;

/**
 * @memberOf Jymfony.Component.Testing.Argument
 */
export default class ArgumentsWildcard {
    /**
     * Constructor.
     *
     * @param {*[]} args
     */
    __construct(args) {
        /**
         * @type {Jymfony.Component.Testing.Argument.Token.TokenInterface[]}
         *
         * @private
         */
        this._tokens = [];

        /**
         * @type {string}
         *
         * @private
         */
        this._string = undefined;

        for (let argument of args) {
            if (! (argument instanceof Token.TokenInterface)) {
                argument = new Token.ExactValueToken(argument);
            }

            this._tokens.push(argument);
        }
    }

    /**
     * @param {Array} args
     *
     * @returns {int|boolean}
     */
    scoreArguments(args) {
        if (0 === args.length && 0 === this._tokens.length) {
            return 1;
        }

        let totalScore = 0;
        for (const [ key, token ] of __jymfony.getEntries(this._tokens)) {
            let score;
            if (1 >= (score = token.scoreArgument(args[key]))) {
                return false;
            }

            totalScore += score;

            if (token.isLast()) {
                return totalScore;
            }
        }

        if (args.length > this._tokens.length) {
            return false;
        }

        return totalScore;
    }

    /**
     * @returns {string}
     */
    toString() {
        if (undefined === this._string) {
            this._string = this._tokens.map(token => token.toString()).join(', ');
        }

        return this._string;
    }
}
