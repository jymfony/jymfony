// Mapping arrays for escaping a double quoted string. The backslash is
// First to ensure proper escaping because str_replace operates iteratively
// On the input arrays. This ordering of the characters avoids the use of strtr,
// Which performs more slowly.
const escapes = {
    '\\': '\\\\', '\\\\': '\\"', '\\"': '\\\\', '"': '\\"',
    '\x00': '\\0', '\x01': '\\x01', '\x02': '\\x02', '\x03': '\\x03',
    '\x04': '\\x04', '\x05': '\\x05', '\x06': '\\x06', '\x07': '\\a',
    '\x08': '\\b', '\x09': '\\t', '\x0a': '\\n', '\x0b': '\\v',
    '\x0c': '\\f', '\x0d': '\\r', '\x0e': '\\x0e', '\x0f': '\\x0f',
    '\x10': '\\x10', '\x11': '\\x11', '\x12': '\\x12', '\x13': '\\x13',
    '\x14': '\\x14', '\x15': '\\x15', '\x16': '\\x16', '\x17': '\\x17',
    '\x18': '\\x18', '\x19': '\\x19', '\x1a': '\\x1a', '\x1b': '\\e',
    '\x1c': '\\x1c', '\x1d': '\\x1d', '\x1e': '\\x1e', '\x1f': '\\x1f',
    '\xc2\x85': '\\N', '\xc2\xa0': '\\_', '\xe2\x80\xa8': '\\L', '\xe2\x80\xa9': '\\P',
};

// Characters that would cause a dumped string to require double quoting.
const REGEX_CHARACTER_TO_ESCAPE = /[\x00-\x1f]|\xc2\x85|\xc2\xa0|\xe2\x80\xa8|\xe2\x80\xa9/;

/**
 * Escaper encapsulates escaping rules for single and double-quoted
 * YAML strings.
 *
 * @memberOf Jymfony.Component.Yaml
 * @internal
 */
export default class Escaper {
    /**
     * Determines if a JSON value would require double quoting in YAML.
     *
     * @param {string} value A JSON value
     *
     * @returns {boolean} True if the value would require double quotes
     */
    static requiresDoubleQuoting(value) {
        return null !== value.match(REGEX_CHARACTER_TO_ESCAPE);
    }

    /**
     * Escapes and surrounds a JSON value with double quotes.
     *
     * @param {string} value A JSON value
     *
     * @returns {string} The quoted, escaped string
     */
    static escapeWithDoubleQuotes(value) {
        return __jymfony.sprintf('"%s"', __jymfony.strtr(value, escapes));
    }

    /**
     * Determines if a JSON value would require single quoting in YAML.
     *
     * @param {string} value A JSON value
     *
     * @returns {boolean} True if the value would require single quotes
     */
    static requiresSingleQuoting(value) {
        // Determines if a JSON value is entirely composed of a value that would
        // Require single quoting in YAML.
        if ([ 'null', '~', 'true', 'false', 'y', 'n', 'yes', 'no', 'on', 'off' ].includes(value.toLowerCase())) {
            return true;
        }

        // Determines if the JSON value contains any single characters that would
        // Cause it to require single quoting in YAML.
        return null !== value.match(/[\s\'"\:\{\}\[\],&\*\#\?]|\A[\-?|<>=!%@`]/);
    }

    /**
     * Escapes and surrounds a JSON value with single quotes.
     *
     * @param {string} value A JSON value
     *
     * @returns {string} The quoted, escaped string
     */
    static escapeWithSingleQuotes(value) {
        return __jymfony.sprintf('\'%s\'', __jymfony.strtr(value, {'\'': '\'\''}));
    }
}
