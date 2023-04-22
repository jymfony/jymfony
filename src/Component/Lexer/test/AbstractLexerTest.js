const ConcreteLexer = Jymfony.Component.Lexer.Fixtures.ConcreteLexer;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

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

export default class AbstractLexerTest extends TestCase {
    _concreteLexer;

    get testCaseName() {
        return '[Lexer] ' + super.testCaseName;
    }

    beforeEach() {
        this._concreteLexer = new ConcreteLexer();
    }

    testResetPeekShouldWork() {
        this._concreteLexer.input = INPUT;
        __self.assertEquals(expectedTokens[0], this._concreteLexer.peek());
        __self.assertEquals(expectedTokens[1], this._concreteLexer.peek());
        this._concreteLexer.resetPeek();
        __self.assertEquals(expectedTokens[0], this._concreteLexer.peek());
    }

    testResetPosition() {
        this._concreteLexer.input = INPUT;
        __self.assertUndefined(this._concreteLexer.token);

        __self.assertTrue(this._concreteLexer.moveNext());
        __self.assertEquals(expectedTokens[0], this._concreteLexer.token);

        __self.assertTrue(this._concreteLexer.moveNext());
        __self.assertEquals(expectedTokens[1], this._concreteLexer.token);

        this._concreteLexer.resetPosition(0);

        __self.assertTrue(this._concreteLexer.moveNext());
        __self.assertEquals(expectedTokens[0], this._concreteLexer.token);
    }

    testShouldMoveToNextToken() {
        this._concreteLexer.input = INPUT;
        __self.assertUndefined(this._concreteLexer.token);

        for (let i = 0; i < expectedTokens.length; ++i) {
            __self.assertTrue(this._concreteLexer.moveNext());
            __self.assertEquals(expectedTokens[i], this._concreteLexer.token);
        }

        __self.assertFalse(this._concreteLexer.moveNext());
        __self.assertUndefined(this._concreteLexer.token);
    }

    testSkipUntilShouldWork() {
        this._concreteLexer.input = INPUT;

        __self.assertTrue(this._concreteLexer.moveNext());
        this._concreteLexer.skipUntil('operator');

        __self.assertEquals(expectedTokens[1], this._concreteLexer.token);
    }

    testShouldParseUtf8Input() {
        this._concreteLexer.input = '\xE9=10';

        __self.assertTrue(this._concreteLexer.moveNext());
        __self.assertEquals({
            value: '\xE9',
            type: 'string',
            position: 0,
            index: 0,
        }, this._concreteLexer.token);
    }

    testPeekShouldWork() {
        this._concreteLexer.input = INPUT;
        for (const expectedToken of expectedTokens) {
            __self.assertEquals(expectedToken, this._concreteLexer.peek());
        }

        __self.assertUndefined(this._concreteLexer.peek());
    }

    testGlimpseShouldWork() {
        this._concreteLexer.input = INPUT;
        for (const expectedToken of expectedTokens) {
            __self.assertEquals(expectedToken, this._concreteLexer.glimpse());
            this._concreteLexer.moveNext();
        }

        __self.assertUndefined(this._concreteLexer.glimpse());
    }

    testGetInputUntilPositionShouldWork() {
        this._concreteLexer.input = INPUT;
        __self.assertEquals('price', this._concreteLexer.getInputUntilPosition(5));
    }

    testIsNextTokenShouldWork() {
        this._concreteLexer.input = INPUT;

        this._concreteLexer.moveNext();
        for (let i = 0; i < expectedTokens.length - 1; ++i) {
            __self.assertTrue(this._concreteLexer.isNextToken(expectedTokens[i + 1].type));
            this._concreteLexer.moveNext();
        }
    }

    testIsNextTokenAnyShouldWork() {
        const allTokenTypes = expectedTokens.map(t => t.type);
        this._concreteLexer.input = INPUT;

        this._concreteLexer.moveNext();
        for (let i = 0; i < expectedTokens.length - 1; ++i) {
            __self.assertTrue(this._concreteLexer.isNextTokenAny([ expectedTokens[i + 1].type ]));
            __self.assertTrue(this._concreteLexer.isNextTokenAny(allTokenTypes));
            this._concreteLexer.moveNext();
        }
    }

    testShouldReturnLiteralConstants() {
        __self.assertEquals('INT', this._concreteLexer.getLiteral('int'));
        __self.assertEquals('fake_token', this._concreteLexer.getLiteral('fake_token'));
    }

    testIsAShouldWork() {
        __self.assertTrue(this._concreteLexer.isA(11, 'int'));
        __self.assertTrue(this._concreteLexer.isA(1.1, 'int'));
        __self.assertTrue(this._concreteLexer.isA('=', 'operator'));
        __self.assertTrue(this._concreteLexer.isA('>', 'operator'));
        __self.assertTrue(this._concreteLexer.isA('<', 'operator'));
        __self.assertTrue(this._concreteLexer.isA('fake_text', 'string'));
    }
}
