const AbstractLexer = Jymfony.Component.Lexer.AbstractLexer;

/**
 * @memberOf Jymfony.Component.DateTime.Parser
 */
export default class Lexer extends AbstractLexer {
    /**
     * @inheritdoc
     */
    getCatchablePatterns() {
        return [
            '\\d+',
            '[+-]\\d{4,}',
            '\\s+',
            '[-/ \\t.:]',
            '[ap][.]?m?[.]?',
            'GMT[+-]',
            '[a-z]+',
            '@',
        ];
    }

    /**
     * @inheritdoc
     */
    getNonCatchablePatterns() {
        return [];
    }

    /**
     * @inheritdoc
     */
    getType(holder) {
        const value = holder.value.toString();

        switch (true) {
            case !! value.match(/^[+-]\d{4,}$/):
                return Lexer.T_SIGNED_YEAR;

            case !! value.match(/^\d+$/):
                return Lexer.T_NUMBER;

            case !! value.match(/^\s+$/):
                return Lexer.T_SPACE;

            case 't' === value || 'T' === value:
                holder.value = 't';
                return Lexer.T_SEPARATOR;

            case !! value.match(/^[-/ \t.:]$/):
                return Lexer.T_SEPARATOR;

            case !! value.match(/^[ap][.]?m?[.]?$/i):
                holder.value = value.toLowerCase();
                return Lexer.T_MERIDIAN;

            case !! value.match(/^gmt[+-]$/i):
                return Lexer.T_GMT;

            case !! value.match(/^[a-z]+$/i):
                return Lexer.T_IDENTIFIER;

            case !! value.match(/^@$/i):
                return Lexer.T_AT;
        }

        throw new InvalidArgumentException(value);
    }
}

Lexer.T_NUMBER = 100;
Lexer.T_SPACE = 101;
Lexer.T_SEPARATOR = 102;
Lexer.T_MERIDIAN = 103;
Lexer.T_GMT = 104;
Lexer.T_SIGNED_YEAR = 105;
Lexer.T_IDENTIFIER = 106;
Lexer.T_AT = 107;
