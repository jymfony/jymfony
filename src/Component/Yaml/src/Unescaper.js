const ParseException = Jymfony.Component.Yaml.Exception.ParseException;

/**
 * Regex fragment that matches an escaped character in a double quoted string.
 */
const REGEX_ESCAPED_CHARACTER = /\\(x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8}|.)/g;

/**
 * Get the UTF-8 character for the given code point.
 *
 * @param {int} c
 *
 * @returns {string}
 */
function utf8chr(c) {
    let buffer;
    if (0x80 > (c %= 0x200000)) {
        buffer = Buffer.from([ c ]);
    } else if (0x800 > c) {
        buffer = Buffer.from([ 0xC0 | c >> 6, 0x80 | c & 0x3F ]);
    } else if (0x10000 > c) {
        buffer = Buffer.from([ 0xE0 | c >> 12, 0x80 | c >> 6 & 0x3F, 0x80 | c & 0x3F ]);
    } else {
        buffer = Buffer.from([ 0xF0 | c >> 18, 0x80 | c >> 12 & 0x3F, 0x80 | c >> 6 & 0x3F, 0x80 | c & 0x3F ]);
    }

    return buffer.toString('utf-8');
}

/**
 * Unescaper encapsulates unescaping rules for single and double-quoted
 * YAML strings.
 *
 * @memberOf Jymfony.Component.Yaml
 * @internal
 */
export default class Unescaper {
    /**
     * Unescapes a single quoted string.
     *
     * @param {string} value A single quoted string
     *
     * @returns {string} The unescaped string
     */
    static unescapeSingleQuotedString(value) {
        return value.replace(/''/g, '\'');
    }

    /**
     * Unescapes a double quoted string.
     *
     * @param {string} value A double quoted string
     *
     * @returns {string} The unescaped string
     */
    static unescapeDoubleQuotedString(value) {
        return value.replace(REGEX_ESCAPED_CHARACTER, (match) => Unescaper.unescapeCharacter(match));
    }

    /**
     * Unescapes a character that was found in a double-quoted string.
     *
     * @param {string} value An escaped character
     *
     * @returns {string} The unescaped character
     */
    static unescapeCharacter(value) {
        switch (value[1]) {
            case '0':
                return '\0';
            case 'a':
                return '\x07';
            case 'b':
                return '\x08';
            case 't':
                return '\t';
            case '\t':
                return '\t';
            case 'n':
                return '\n';
            case 'v':
                return '\x0B';
            case 'f':
                return '\x0C';
            case 'r':
                return '\r';
            case 'e':
                return '\x1B';
            case ' ':
                return ' ';
            case '"':
                return '"';
            case '/':
                return '/';
            case '\\':
                return '\\';
            case 'N':
                // U+0085 NEXT LINE
                return '\xC2\x85';
            case '_':
                // U+00A0 NO-BREAK SPACE
                return '\xC2\xA0';
            case 'L':
                // U+2028 LINE SEPARATOR
                return '\xE2\x80\xA8';
            case 'P':
                // U+2029 PARAGRAPH SEPARATOR
                return '\xE2\x80\xA9';
            case 'x':
                return utf8chr(parseInt(value.substr(2, 2), 16));
            case 'u':
                return utf8chr(parseInt(value.substr(2, 4), 16));
            case 'U':
                return utf8chr(parseInt(value.substr(2, 8), 16));
            default:
                throw new ParseException(__jymfony.sprintf('Found unknown escape character "%s".', value));
        }
    }
}
