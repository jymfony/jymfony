try {
    require('../../../../util');
} catch (e) {
    require('@jymfony/util');
}

const Lexer = require('./Lexer');

const expect = (condition, message = undefined) => {
    if (! condition) {
        throw new SyntaxError(message);
    }
};

/**
 * @param {Jymfony.Component.Autoloader.Parser.Lexer} lexer
 *
 * @return {Jymfony.Component.Autoloader.Parser.Token}
 */
const lookaheadSkipSpaces = (lexer) => {
    let next;
    while ((next = lexer.peek()) && next.type === Lexer.T_SPACE) {}

    return next;
};

/**
 * @param {Jymfony.Component.Autoloader.Parser.Lexer} lexer
 */
const skipSpaces = (lexer) => {
    while (lexer.moveNext() && lexer.token.type === Lexer.T_SPACE) { }
};

module.exports = { expect, lookaheadSkipSpaces, skipSpaces };
