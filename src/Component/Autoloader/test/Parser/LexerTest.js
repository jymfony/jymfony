/* eslint-disable no-template-curly-in-string */
const Lexer = require('../../src/Parser/Lexer');
const { expect } = require('chai');

describe('[Autoloader] Lexer', function () {
    it ('can parse multiple backtick strings on the same line', () => {
        const lexer = new Lexer();

        lexer.input = '`${l}\\n` : `${sp}${l}\\n`';
        expect(lexer._tokens).to.be.deep.eq([
            { value: '`${l}\\n`', type: Lexer.T_STRING, position: 0, index: 0 },
            { value: ' ', type: Lexer.T_SPACE, position: 8, index: 1 },
            { value: ':', type: Lexer.T_COLON, position: 9, index: 2 },
            { value: ' ', type: Lexer.T_SPACE, position: 10, index: 3 },
            { value: '`${sp}${l}\\n`', type: Lexer.T_STRING, position: 11, index: 4 },
            { value: 'end-of-file', type: Lexer.T_EOF, position: 24, index: 5 },
        ]);
    });
});
