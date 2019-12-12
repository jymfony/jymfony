const Inline = Jymfony.Component.Yaml.Inline;
const Yaml = Jymfony.Component.Yaml.Yaml;

/**
 * Dumper dumps JSON variables to YAML strings.
 *
 * @memberOf Jymfony.Component.Yaml
 * @final
 */
export default class Dumper {
    /**
     * Constructor.
     *
     * @param {int} indentation
     */
    __construct(indentation = 4) {
        if (1 > indentation) {
            throw new InvalidArgumentException('The indentation must be greater than zero.');
        }

        /**
         * The amount of spaces to use for indentation of nested nodes.
         *
         * @type {int}
         *
         * @protected
         */
        this._indentation = indentation;
    }

    /**
     * Dumps a JSON value to YAML.
     *
     * @param {*} input The JSON value
     * @param {int} [inline = 0] The level where you switch to inline YAML
     * @param {int} [indent = 0] The level of indentation (used internally)
     * @param {int} [flags = 0] A bit field of Yaml.DUMP_* constants to customize the dumped YAML string
     *
     * @returns {string} The YAML representation of the JSON value
     */
    dump(input, inline = 0, indent = 0, flags = 0) {
        let output = '';
        const prefix = indent ? ' '.repeat(indent) : '';

        if (0 >= inline || (! isArray(input) && ! isObjectLiteral(input)) || 0 === Object.keys(input).length) {
            output += prefix + Inline.dump(input, flags);
        } else {
            const dumpAsMap = isObjectLiteral(input);
            for (const [ key, value ] of __jymfony.getEntries(input)) {
                if (1 <= inline && Yaml.DUMP_MULTI_LINE_LITERAL_BLOCK & flags && isString(value) && -1 !== value.indexOf('\n') && -1 === value.indexOf('\r\n')) {
                    // If the first line starts with a space character, the spec requires a blockIndicationIndicator
                    // http://www.yaml.org/spec/1.2/spec.html#id2793979
                    const blockIndentationIndicator = (' ' === value[0]) ? String(this._indentation) : '';
                    output += __jymfony.sprintf('%s%s%s |%s\n', prefix, dumpAsMap ? Inline.dump(key, flags) + ':' : '-', '', blockIndentationIndicator);

                    for (const row of value.split(/\n|\r\n/g)) {
                        output += __jymfony.sprintf('%s%s%s\n', prefix, ' '.repeat(this._indentation), row);
                    }

                    continue;
                }

                const willBeInlined = 0 >= inline - 1 || (! isArray(value) && ! isObjectLiteral(value)) || 0 === Object.keys(value).length;

                output += __jymfony.sprintf('%s%s%s%s',
                    prefix,
                    dumpAsMap ? Inline.dump(key, flags) + ':' : '-',
                    willBeInlined ? ' ' : '\n',
                    this.dump(value, inline - 1, willBeInlined ? 0 : indent + this._indentation, flags)
                ) + (willBeInlined ? '\n' : '');
            }
        }

        return output;
    }
}
