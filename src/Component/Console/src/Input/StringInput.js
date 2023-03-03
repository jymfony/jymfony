const ArgvInput = Jymfony.Component.Console.Input.ArgvInput;

const REGEX_UNQUOTED_STRING = '([^\s\\\\]+?)';
const REGEX_QUOTED_STRING = '(?:"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"|\'([^\'\\\\]*(?:\\\\.[^\'\\\\]*)*)\')';

/**
 * StringInput represents an input provided as a string.
 *
 * Usage:
 *
 *     const input = new StringInput('foo --bar="foobar"');
 *
 * @memberOf Jymfony.Component.Console.Input
 */
export default class StringInput extends ArgvInput {
    /**
     * @param {string} input A string representing the parameters from the CLI
     */
    __construct(input) {
        super.__construct([]);

        this._tokens = this._tokenize(input);
    }

    /**
     * Tokenizes a string.
     *
     * @param {string} input
     *
     * @returns {string[]}
     *
     * @throws {InvalidArgumentException} When unable to parse input (should never happen)
     * @private
     */
    _tokenize(input) {
        const tokens = [];
        const length = input.length;

        let cursor = 0;
        let token = '';
        while (cursor < length) {
            if ('\\' === input[cursor]) {
                token += input[++cursor] || '';
                ++cursor;
                continue;
            }

            let match;
            const currentInput = input.substring(cursor);
            if ((match = currentInput.match(/^\s+/))) {
                if ('' !== token) {
                    tokens.push(token);
                    token = '';
                }
            } else if ((match = currentInput.match(new RegExp('^([^="\'\\s]+?)(=?)(' + REGEX_QUOTED_STRING + '+)')))) {
                token += match[1] + match[2] + match[3].substring(1, match[3].length - 1)
                    .replace(/("'|'"|''|"")/g, '')
                    .replace(/\\(.)/g, (match, char) => {
                        return {'t': '\t', 'r': '\r', 'n': '\n', '0': '\0'}[char] || match;
                    });
            } else if ((match = currentInput.match(new RegExp('^' + REGEX_QUOTED_STRING)))) {
                token += match[0].substring(1, match[0].length - 1).replace(/\\(.)/g, (match, char) => {
                    return {'t': '\t', 'r': '\r', 'n': '\n', '0': '\0'}[char] || match;
                });
            } else if ((match = currentInput.match(new RegExp('^' + REGEX_UNQUOTED_STRING)))) {
                token += match[1];
            } else {
                // Should never happen
                throw new InvalidArgumentException(__jymfony.sprintf('Unable to parse input near "... %s ...".', input.substring(cursor, cursor + 10)));
            }

            cursor += match[0].length;
        }

        if ('' !== token) {
            tokens.push(token);
        }

        return tokens;
    }
}
