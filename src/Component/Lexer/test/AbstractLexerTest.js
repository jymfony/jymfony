const ConcreteLexer = Jymfony.Component.Lexer.Fixtures.ConcreteLexer;
const { expect } = require('chai');

describe('[Lexer] AbstractLexer', function () {
    /**
     * @type {Jymfony.Component.Lexer.Fixtures.ConcreteLexer}
     *
     * @private
     */
    this._concreteLexer = undefined;

    beforeEach(() => {
        this._concreteLexer = new ConcreteLexer();
    });

    const INPUT = 'price=10';
    const expectedTokens = [
        {
            value: 'price',
            type: 'string',
            position: 0,
            index: 0,
        },
        {
            value: '=',
            type: 'operator',
            position: 5,
            index: 1,
        },
        {
            value: '10',
            type: 'int',
            position: 6,
            index: 2,
        },
    ];

    it ('resetPeek should work', () => {
        this._concreteLexer.input = INPUT;
        expect(this._concreteLexer.peek()).to.dump.as(expectedTokens[0]);
        expect(this._concreteLexer.peek()).to.dump.as(expectedTokens[1]);
        this._concreteLexer.resetPeek();
        expect(this._concreteLexer.peek()).to.dump.as(expectedTokens[0]);
    });

    it ('reset position should work', () => {
        this._concreteLexer.input = INPUT;
        expect(this._concreteLexer.token).to.be.equal(undefined);

        expect(this._concreteLexer.moveNext()).to.be.equal(true);
        expect(this._concreteLexer.token).to.dump.as(expectedTokens[0]);

        expect(this._concreteLexer.moveNext()).to.be.equal(true);
        expect(this._concreteLexer.token).to.dump.as(expectedTokens[1]);

        this._concreteLexer.resetPosition(0);

        expect(this._concreteLexer.moveNext()).to.be.equal(true);
        expect(this._concreteLexer.token).to.dump.as(expectedTokens[0]);
    });

    it ('should move to next token', () => {
        this._concreteLexer.input = INPUT;
        expect(this._concreteLexer.token).to.be.equal(undefined);

        for (let i = 0; i < expectedTokens.length; ++i) {
            expect(this._concreteLexer.moveNext()).to.be.equal(true);
            expect(this._concreteLexer.token).to.dump.as(expectedTokens[i]);
        }

        expect(this._concreteLexer.moveNext()).to.be.equal(false);
        expect(this._concreteLexer.token).to.be.equal(undefined);
    });

    it ('skipUntil should work', () => {
        this._concreteLexer.input = INPUT;

        expect(this._concreteLexer.moveNext()).to.be.equal(true);
        this._concreteLexer.skipUntil('operator');

        expect(this._concreteLexer.token).to.dump.as(expectedTokens[1]);
    });

    it ('should parse utf-8 input', () => {
        this._concreteLexer.input = '\xE9=10';

        expect(this._concreteLexer.moveNext()).to.be.equal(true);
        expect(this._concreteLexer.token).to.dump.as({
            value: '\xE9',
            type: 'string',
            position: 0,
            index: 0,
        });
    });

    it ('peek should work', () => {
        this._concreteLexer.input = INPUT;
        for (const expectedToken of expectedTokens) {
            expect(this._concreteLexer.peek()).to.dump.as(expectedToken);
        }

        expect(this._concreteLexer.peek()).to.be.equal(undefined);
    });

    it ('glimpse should work', () => {
        this._concreteLexer.input = INPUT;
        for (const expectedToken of expectedTokens) {
            expect(this._concreteLexer.glimpse()).to.dump.as(expectedToken);
            this._concreteLexer.moveNext();
        }

        expect(this._concreteLexer.glimpse()).to.be.equal(undefined);
    });

    it ('getInputUntilPosition should work', () => {
        this._concreteLexer.input = INPUT;
        expect(this._concreteLexer.getInputUntilPosition(5)).to.be.equal('price');
    });

    it ('isNextToken should work', () => {
        this._concreteLexer.input = INPUT;

        this._concreteLexer.moveNext();
        for (let i = 0; i < expectedTokens.length; ++i) {
            expect(this._concreteLexer.isNextToken(expectedTokens[i].type));
            this._concreteLexer.moveNext();
        }
    });

    it ('isNextTokenAny should work', () => {
        const allTokenTypes = expectedTokens.map(t => t.type);
        this._concreteLexer.input = INPUT;

        this._concreteLexer.moveNext();
        for (let i = 0; i < expectedTokens.length - 1; ++i) {
            expect(this._concreteLexer.isNextTokenAny([ expectedTokens[i + 1].type ])).to.be.equal(true);
            expect(this._concreteLexer.isNextTokenAny(allTokenTypes)).to.be.equal(true);
            this._concreteLexer.moveNext();
        }
    });

    it ('should returns literal constants', () => {
        expect(this._concreteLexer.getLiteral('int')).to.be.equal('INT');
        expect(this._concreteLexer.getLiteral('fake_token')).to.be.equal('fake_token');
    });

    it ('isA should work', () => {
        expect(this._concreteLexer.isA(11, 'int')).to.be.equal(true);
        expect(this._concreteLexer.isA(1.1, 'int')).to.be.equal(true);
        expect(this._concreteLexer.isA('=', 'operator')).to.be.equal(true);
        expect(this._concreteLexer.isA('>', 'operator')).to.be.equal(true);
        expect(this._concreteLexer.isA('<', 'operator')).to.be.equal(true);
        expect(this._concreteLexer.isA('fake_text', 'string')).to.be.equal(true);
    });
});
