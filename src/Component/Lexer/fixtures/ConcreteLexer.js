const AbstractLexer = Jymfony.Component.Lexer.AbstractLexer;

/**
 * @memberOf Jymfony.Component.Lexer.Fixtures
 */
export default class ConcreteLexer extends AbstractLexer {
    getCatchablePatterns() {
        return [
            '=|<|>',
            '[a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F]+',
            '\\d+',
        ];
    }

    getNonCatchablePatterns() {
        return [
            '\\s+',
            '(.)',
        ];
    }

    getType(holder) {
        const value = holder.value;

        if (isNumeric(value)) {
            return 'int';
        }

        if ([ '=', '<', '>' ].includes(value)) {
            return 'operator';
        }

        if (isString(value)) {
            return 'string';
        }

        return null;
    }
}

ConcreteLexer.INT = 'int';
