const DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;
const DumpException = Jymfony.Component.Yaml.Exception.DumpException;
const Escaper = Jymfony.Component.Yaml.Escaper;
const ParseException = Jymfony.Component.Yaml.Exception.ParseException;
const Parser = Jymfony.Component.Yaml.Parser;
const ValueHolder = Jymfony.Component.Yaml.Internal.ValueHolder;
const TaggedValue = Jymfony.Component.Yaml.Tag.TaggedValue;
const Unescaper = Jymfony.Component.Yaml.Unescaper;
const Yaml = Jymfony.Component.Yaml.Yaml;

let exceptionOnInvalidType = false;
let objectSupport = false;

/**
 * Regex that matches a YAML date.
 *
 * @see http://www.yaml.org/spec/1.2/spec.html#id2761573
 */
const timestampRegex = /^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:(?:[Tt]|[ \t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\.([0-9]*))?(?:[ \t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?)?$/;

/**
 * Regex that matches a YAML number in hexadecimal notation.
 */
const hexRegex = /^0x[0-9a-f_]+$/i;

/**
 * Inline implements a YAML parser/dumper for the YAML inline syntax.
 *
 * @memberOf Jymfony.Component.Yaml
 * @internal
 */
export default class Inline {
    /**
     * @param {int} flags
     * @param {null|int} [parsedLineNumber]
     * @param {null|string} [parsedFilename]
     */
    static initialize(flags, parsedLineNumber = null, parsedFilename = null) {
        exceptionOnInvalidType = !! (Yaml.PARSE_EXCEPTION_ON_INVALID_TYPE & flags);
        objectSupport = !! (Yaml.PARSE_OBJECT & flags);
        __self.parsedFilename = parsedFilename;

        if (null !== parsedLineNumber) {
            __self.parsedLineNumber = parsedLineNumber;
        }
    }

    /**
     * Converts a YAML string to a JSON value.
     *
     * @param {string} [value] A YAML string
     * @param {int} [flags] A bit field of PARSE_* constants to customize the YAML parser behavior
     * @param {*} [references] Mapping of variable names to values
     *
     * @returns {*} A JSON value
     *
     * @throws {Jymfony.Component.Yaml.Exception.ParseException}
     */
    static parse(value = null, flags = 0, references = {}) {
        __self.initialize(flags);
        value = __jymfony.trim(value);

        if ('' === value) {
            return '';
        }

        /**
         * @type {Jymfony.Component.Yaml.Internal.ValueHolder<int>}
         */
        const i = new ValueHolder(0);

        let result;
        const tag = __self.parseTag(value, i, flags);
        switch (value[i]) {
            case '[':
                result = __self.parseSequence(value, flags, i, references);
                i._++;
                break;

            case '{':
                result = __self.parseMapping(value, flags, i, references);
                i._++;
                break;

            default:
                result = __self.parseScalar(value, flags, null, i, null === tag, references);
        }

        if (null !== tag && '' !== tag) {
            return new TaggedValue(tag, result);
        }

        // Some comments are allowed at the end
        if (value.substr(i.value).replace(/\s+#.*$/g, '')) {
            throw new ParseException(__jymfony.sprintf('Unexpected characters near "%s".', value.substr(i)), __self.parsedLineNumber + 1, value, __self.parsedFilename);
        }

        return result;
    }

    /**
     * Dumps a given JS variable to a YAML string.
     *
     * @param {*} value The JS variable to convert
     * @param {int} flags A bit field of Yaml::DUMP_* constants to customize the dumped YAML string
     *
     * @returns {string} The YAML string representing the JSON value
     *
     * @throws {Jymfony.Component.Yaml.Exception.DumpException} When trying to dump JS resource
     */
    static dump(value, flags = 0) {
        if (value instanceof DateTimeInterface) {
            return value.format('c');
        }

        switch (true) {
            case value instanceof Date:
                return value.toISOString();

            case isArray(value):
                return __self.dumpArray(value, flags);

            case isObjectLiteral(value):
                return __self.dumpHash(value, flags);

            case isObject(value) && ! isObjectLiteral(value):
                if (value instanceof TaggedValue) {
                    return '!' + value.tag + ' ' + __self.dump(value.value, flags);
                }

                if ((Yaml.DUMP_OBJECT & flags)) {
                    return '!js/object ' + __self.dump(__jymfony.serialize(value));
                }

                if (Yaml.DUMP_EXCEPTION_ON_INVALID_TYPE & flags) {
                    throw new DumpException('Object support when dumping a YAML file has been disabled.');
                }

                return 'null';

            case null === value:
                return 'null';

            case true === value:
                return 'true';

            case false === value:
                return 'false';

            case isNumber(value): {
                const repr = String(value);

                if (isNaN(value)) {
                    return '.nan';
                }

                if (! isFinite(value)) {
                    return repr.replace(/Infinity/, '.Inf');
                }

                return repr;
            }

            case isNumeric(value):
                return isString(value) ? `'${value}'` : value;

            case '' === value:
                return '\'\'';

            case __self.isBinaryString(value):
            case isBuffer(value):
                return '!!binary ' + Buffer.from(value).toString('base64');

            case Escaper.requiresDoubleQuoting(value):
                return Escaper.escapeWithDoubleQuotes(value);

            case Escaper.requiresSingleQuoting(value):
            case Parser.preg_match(/^[0-9]+[_0-9]*$/, value):
            case Parser.preg_match(hexRegex, value):
            case Parser.preg_match(timestampRegex, value):
                return Escaper.escapeWithSingleQuotes(value);

            default:
                return value;
        }
    }

    /**
     * Dumps a JS array to a YAML string.
     *
     * @param {Array} value The JSON array to dump
     * @param {int} flags A bit field of Yaml.DUMP_* constants to customize the dumped YAML string
     *
     * @returns {string} The YAML string representing the JS array
     */
    static dumpArray(value, flags) {
        const output = [];
        for (const val of value) {
            output.push(__self.dump(val, flags));
        }

        return __jymfony.sprintf('[%s]', output.join(', '));
    }

    /**
     * Dumps a JS object to a YAML string.
     *
     * @param {object} value The JSON object to dump
     * @param {int} flags A bit field of Yaml.DUMP_* constants to customize the dumped YAML string
     *
     * @returns {string} The YAML string representing the JS array
     */
    static dumpHash(value, flags) {
        const output = [];
        for (const [ key, val ] of __jymfony.getEntries(value)) {
            output.push(__jymfony.sprintf('%s: %s', __self.dump(key, flags), __self.dump(val, flags)));
        }

        return __jymfony.sprintf('{ %s }', output.join(', '));
    }

    /**
     * Parses a YAML scalar.
     *
     * @param {*} scalar
     * @param {int} [flags = 0]
     * @param {string[]|null} [delimiters]
     * @param {Jymfony.Component.Yaml.Internal.ValueHolder<int>} [i = new Jymfony.Component.Yaml.Internal.ValueHolder(0)]
     * @param {boolean} [evaluate = true]
     * @param {*} [references = {}]
     *
     * @returns {*}
     *
     * @throws {Jymfony.Component.Yaml.Exception.DumpException} When malformed inline YAML string is parsed
     */
    static parseScalar(scalar, flags = 0, delimiters = null, i = new ValueHolder(0), evaluate = true, references = {}) {
        let output;
        if ([ '"', '\'' ].includes(scalar[i._])) {
            // Quoted scalar
            output = __self.parseQuotedScalar(scalar, i);

            if (null !== delimiters) {
                const tmp = __jymfony.ltrim(scalar.substr(i.value), ' ');
                if ('' === tmp) {
                    throw new ParseException(__jymfony.sprintf('Unexpected end of line, expected one of "%s".', delimiters.join('')), __self.parsedLineNumber + 1, scalar, __self.parsedFilename);
                }

                if (! delimiters.includes(tmp[0])) {
                    throw new ParseException(__jymfony.sprintf('Unexpected characters (%s).', scalar.substr(i._)), __self.parsedLineNumber + 1, scalar, __self.parsedFilename);
                }
            }
        } else {
            let match;

            // "normal" string
            if (! delimiters || 0 === delimiters.length) {
                output = scalar.substr(i._);
                i._ += output.length;

                // Remove comments
                const tabRegex = /[ \t]+#/g;
                if ((match = tabRegex.exec(output))) {
                    output = output.substr(0, tabRegex.lastIndex - match[0].length);
                }
            } else if ((match = Parser.preg_match(new RegExp('^(.*?)[' + __jymfony.regex_quote(delimiters.join('')) + ']'), scalar.substr(i._)))) {
                output = match[1];
                i._ += output.length;
                output = __jymfony.trim(output);
            } else {
                throw new ParseException(__jymfony.sprintf('Malformed inline YAML string: %s.', scalar), __self.parsedLineNumber + 1, null, __self.parsedFilename);
            }

            // A non-quoted string cannot start with @ or ` (reserved) nor with a scalar indicator (| or >)
            if (output && ('@' === output[0] || '`' === output[0] || '|' === output[0] || '>' === output[0] || '%' === output[0])) {
                throw new ParseException(__jymfony.sprintf('The reserved indicator "%s" cannot start a plain scalar; you need to quote the scalar.', output[0]), __self.parsedLineNumber + 1, output, __self.parsedFilename);
            }

            if (evaluate) {
                output = __self.evaluateScalar(output, flags, references);
            }
        }

        return output;
    }

    /**
     * Parses a YAML quoted scalar.
     *
     * @param {*} scalar
     * @param {Jymfony.Component.Yaml.Internal.ValueHolder<int>} i
     *
     * @returns {*}
     *
     * @throws {Jymfony.Component.Yaml.Exception.ParseException} When malformed inline YAML string is parsed
     */
    static parseQuotedScalar(scalar, i) {
        let match;
        if (! (match = Parser.preg_match(new RegExp(__self.REGEX_QUOTED_STRING), scalar.substr(i.value)))) {
            throw new ParseException(__jymfony.sprintf('Malformed inline YAML string: %s.', scalar.substr(i.value)), __self.parsedLineNumber + 1, scalar, __self.parsedFilename);
        }

        let output = match[0].substr(1, match[0].length - 2);

        if ('"' === scalar[i]) {
            output = Unescaper.unescapeDoubleQuotedString(output);
        } else {
            output = Unescaper.unescapeSingleQuotedString(output);
        }

        i._ += match[0].length;

        return output;
    }

    /**
     * Parses a YAML sequence.
     *
     * @param {string} sequence
     * @param {int} flags
     * @param {Jymfony.Component.Yaml.Internal.ValueHolder<int>} [i = new Jymfony.Component.Yaml.Internal.ValueHolder(0)]
     * @param {Object.<string, *>} [references = {}]
     *
     * @throws {Jymfony.Component.Yaml.Exception.ParseException} When malformed inline YAML string is parsed
     */
    static parseSequence(sequence, flags, i = new ValueHolder(0), references = {}) {
        const output = [];
        const len = sequence.length;
        let value;
        i._++;

        // [foo, bar, ...]
        while (i.value < len) {
            if (']' === sequence[i]) {
                return output;
            }

            if (',' === sequence[i] || ' ' === sequence[i]) {
                i._++;

                continue;
            }

            const tag = __self.parseTag(sequence, i, flags);
            switch (sequence[i]) {
                case '[':
                    // Nested sequence
                    value = __self.parseSequence(sequence, flags, i, references);
                    break;

                case '{':
                    // Nested mapping
                    value = __self.parseMapping(sequence, flags, i, references);
                    break;

                default: {
                    const isQuoted = [ '"', '\'' ].includes(sequence[i]);
                    value = __self.parseScalar(sequence, flags, [ ',', ']' ], i, null === tag, references);

                    // The value can be an array if a reference has been resolved to an array var
                    if (isString(value) && !isQuoted && -1 !== value.indexOf(': ')) {
                        // Embedded mapping?
                        try {
                            const pos = new ValueHolder(0);
                            value = __self.parseMapping('{' + value + '}', flags, pos, references);
                        } catch (e) {
                            if (! (e instanceof InvalidArgumentException)) {
                                throw e;
                            }

                            // No, it's not
                        }
                    }

                    i._--;
                }
            }

            if (null !== tag && '' !== tag) {
                value = new TaggedValue(tag, value);
            }

            output.push(value);

            i._++;
        }

        throw new ParseException(__jymfony.sprintf('Malformed inline YAML string: %s.', sequence), __self.parsedLineNumber + 1, null, __self.parsedFilename);
    }

    /**
     * Parses a YAML mapping.
     *
     * @param {string} mapping
     * @param {int} flags
     * @param {Jymfony.Component.Yaml.Internal.ValueHolder<int>} [i = new Jymfony.Component.Yaml.Internal.ValueHolder(0)]
     * @param {Object.<string, *>} [references = {}]
     *
     * @returns {Object.<string|int, *>}
     *
     * @throws {Jymfony.Component.Yaml.Exception.ParseException} When malformed inline YAML string is parsed
     */
    static parseMapping(mapping, flags, i = new ValueHolder(0), references = {}) {
        const output = {};
        const len = mapping.length;
        i._++;
        let allowOverwrite = false;

        // {foo: bar, bar:foo, ...}
        main: while (i < len) {
            switch (mapping[i]) {
                case ' ':
                case ',':
                    i._++;
                    continue;

                case '}':
                    return output;
            }

            // Key
            const offsetBeforeKeyParsing = i.value;
            const isKeyQuoted = [ '"', '\'' ].includes(mapping[i]);
            const key = __self.parseScalar(mapping, flags, [ ':', ' ' ], i, false, {});

            if (offsetBeforeKeyParsing === i.value) {
                throw new ParseException('Missing mapping key.', __self.parsedLineNumber + 1, mapping);
            }

            if (-1 === (i._ = mapping.indexOf(':', i._))) {
                break;
            }

            if (! isKeyQuoted) {
                const evaluatedKey = __self.evaluateScalar(key, flags, references);

                if ('' !== key && evaluatedKey !== key && ! isString(evaluatedKey) && ! isNumber(evaluatedKey)) {
                    throw new ParseException('Implicit casting of incompatible mapping keys to strings is not supported. Quote your evaluable mapping keys instead.', __self.parsedLineNumber + 1, mapping);
                }
            }

            if (! isKeyQuoted && ! [ ' ', ',', '[', ']', '{', '}' ].includes(mapping[i + 1])) {
                throw new ParseException('Colons must be followed by a space or an indication character (i.e. " ", ",", "[", "]", "{", "}").', __self.parsedLineNumber + 1, mapping);
            }

            if ('<<' === key) {
                allowOverwrite = true;
            }

            while (i < len) {
                if (':' === mapping[i] || ' ' === mapping[i]) {
                    i._++;

                    continue;
                }

                const tag = __self.parseTag(mapping, i, flags);
                switch (mapping[i]) {
                    case '[': {
                        // Nested sequence
                        const value = __self.parseSequence(mapping, flags, i, references);
                        // Spec: Keys MUST be unique; first one wins.
                        // Parser cannot abort this mapping earlier, since lines
                        // Are processed sequentially.
                        // But overwriting is allowed when a merge node is used in current block.
                        if ('<<' === key) {
                            for (const parsedValue of value) {
                                Object.assign(output, parsedValue, { ...output });
                            }
                        } else if (allowOverwrite || undefined === output[key]) {
                            if (null !== tag) {
                                output[key] = new TaggedValue(tag, value);
                            } else {
                                output[key] = value;
                            }
                        } else if (undefined !== output[key]) {
                            throw new ParseException(__jymfony.sprintf('Duplicate key "%s" detected.', key), __self.parsedLineNumber + 1, mapping);
                        }
                    } break;

                    case '{': {
                        // Nested mapping
                        const value = __self.parseMapping(mapping, flags, i, references);
                        // Spec: Keys MUST be unique; first one wins.
                        // Parser cannot abort this mapping earlier, since lines
                        // Are processed sequentially.
                        // But overwriting is allowed when a merge node is used in current block.
                        if ('<<' === key) {
                            Object.assign(output, value, { ...output });
                        } else if (allowOverwrite || undefined === output[key]) {
                            if (null !== tag) {
                                output[key] = new TaggedValue(tag, value);
                            } else {
                                output[key] = value;
                            }
                        } else if (undefined !== output[key]) {
                            throw new ParseException(__jymfony.sprintf('Duplicate key "%s" detected.', key), __self.parsedLineNumber + 1, mapping);
                        }
                    } break;

                    default: {
                        const value = __self.parseScalar(mapping, flags, [ ',', '}' ], i, null === tag, references);
                        // Spec: Keys MUST be unique; first one wins.
                        // Parser cannot abort this mapping earlier, since lines
                        // Are processed sequentially.
                        // But overwriting is allowed when a merge node is used in current block.
                        if ('<<' === key) {
                            Object.assign(output, value, { ...output });
                        } else if (allowOverwrite || undefined === output[key]) {
                            if (null !== tag) {
                                output[key] = new TaggedValue(tag, value);
                            } else {
                                output[key] = value;
                            }
                        } else if (undefined !== output[key]) {
                            throw new ParseException(__jymfony.sprintf('Duplicate key "%s" detected.', key), __self.parsedLineNumber + 1, mapping);
                        }

                        i._--;
                    }
                }

                i._++;
                continue main;
            }
        }

        throw new ParseException(__jymfony.sprintf('Malformed inline YAML string: %s.', mapping), __self.parsedLineNumber + 1, null, __self.parsedFilename);
    }

    /**
     * Evaluates scalars and replaces magic values.
     *
     * @param {string} scalar
     * @param {int} flags
     * @param {Object.<string, *>} [references = {}]
     *
     * @returns {*} The evaluated YAML string
     *
     * @throws {Jymfony.Component.Yaml.Exception.ParseException} when object parsing support was disabled and the parser detected a JS object or when a reference could not be resolved
     */
    static evaluateScalar(scalar, flags, references = {}) {
        scalar = __jymfony.trim(scalar);
        const scalarLower = scalar.toLowerCase();

        let value;
        if (0 === scalar.indexOf('*')) {
            let pos;
            if (-1 !== (pos = scalar.indexOf('#'))) {
                value = scalar.substr(1, pos - 2);
            } else {
                value = scalar.substr(1);
            }

            // An unquoted *
            if (false === value || '' === value) {
                throw new ParseException('A reference must contain at least one character.', __self.parsedLineNumber + 1, value, __self.parsedFilename);
            }

            if (undefined === references[value]) {
                throw new ParseException(__jymfony.sprintf('Reference "%s" does not exist.', value), __self.parsedLineNumber + 1, value, __self.parsedFilename);
            }

            return references[value];
        }

        switch (true) {
            case 'null' === scalarLower:
            case '' === scalar:
            case '~' === scalar:
                return null;

            case 'true' === scalarLower:
                return true;

            case 'false' === scalarLower:
                return false;

            case '!' === scalar[0]:
                switch (true) {
                    case 0 === scalar.indexOf('!!str '):
                        return String(scalar.substr(6));

                    case 0 === scalar.indexOf('! '):
                        return scalar.substr(2);

                    case 0 === scalar.indexOf('!js/object'):
                        if (objectSupport) {
                            return __jymfony.unserialize(__self.parseScalar(scalar.substr(11)));
                        }

                        if (exceptionOnInvalidType) {
                            throw new ParseException('Object support when parsing a YAML file has been disabled.', __self.parsedLineNumber + 1, scalar, __self.parsedFilename);
                        }

                        return null;

                    case 0 === scalar.indexOf('!!float '):
                        return Number.parseFloat(scalar.substr(8));

                    case 0 === scalar.indexOf('!!binary '):
                        return __self.evaluateBinaryScalar(scalar.substr(9));

                    default:
                        throw new ParseException(__jymfony.sprintf('The string "%s" could not be parsed as it uses an unsupported built-in tag.', scalar), __self.parsedLineNumber, scalar, __self.parsedFilename);
                }

            // Optimize for returning strings.
            // No break
            case '+' === scalar[0] || '-' === scalar[0] || '.' === scalar[0] || isNumeric(scalar[0]):
                switch (true) {
                    case !! Parser.preg_match(/^[+-]?[0-9][0-9_]*$/, scalar):
                        scalar = scalar.replace(/_/g, '');
                        // Omitting the break / return as integers are handled in the next case
                        // No break

                    case !! scalar.match(/^\d+$/): {
                        const raw = scalar;
                        const cast = ~~scalar;

                        return '0' === scalar[0] ? Number.parseInt(scalar, 8) : ((raw == cast.toString()) ? cast : raw);
                    }

                    case '-' === scalar[0] && !! scalar.substr(1).match(/^\d+$/): {
                        const raw = scalar;
                        const cast = ~~scalar;

                        return '0' === scalar[1] ? Number.parseInt(scalar, 8) : ((raw == cast.toString()) ? cast : raw);
                    }

                    case isNumeric(scalar):
                    case !! Parser.preg_match(hexRegex, scalar):
                        scalar = scalar.replace(/_/g, '');

                        return '0x' === scalar[0] + scalar[1] ? Number.parseInt(scalar.substr(2), 16) : Number.parseFloat(scalar);

                    case '.inf' === scalarLower:
                        return Infinity;
                    case '.nan' === scalarLower:
                        return NaN;
                    case '-.inf' === scalarLower:
                        return -Infinity;
                    case !! Parser.preg_match(/^(-|\+)?[0-9][0-9_]*(\.[0-9_]+)?$/, scalar):
                        return scalar.replace(/_/g, '');
                    case !! Parser.preg_match(timestampRegex, scalar):
                        if (Yaml.PARSE_DATETIME & flags) {
                            // When no timezone is provided in the parsed date, YAML spec says we must assume UTC.
                            return new Jymfony.Component.DateTime.DateTime(scalar, Jymfony.Component.DateTime.DateTimeZone.get('UTC'));
                        }

                        return new Date(scalar);
                }
        }

        return String(scalar);
    }

    /**
     * @param {string} value
     * @param {Jymfony.Component.Yaml.Internal.ValueHolder} i
     * @param {int} flags
     *
     * @returns {null|*}
     */
    static parseTag(value, i, flags) {
        if ('!' !== value[i]) {
            return null;
        }

        const tagLength = __jymfony.strcspn(value, ' \t\n[]{}', i + 1);
        const tag = value.substr(i + 1, tagLength);

        let nextOffset = i + tagLength + 1;
        nextOffset += value.substr(nextOffset).match(/^[ ]*/)[0].length;

        // Is followed by a scalar and is a built-in tag
        if (tag && (undefined === value[nextOffset] || ! ([ '[', '{' ].includes(value[nextOffset]))) && ('!' === tag[0] || 'str' === tag || 'js/object' === tag)) {
            // Manage in {@link __self.evaluateScalar()}
            return null;
        }

        i._ = nextOffset;

        // Built-in tags
        if (tag && '!' === tag[0]) {
            throw new ParseException(__jymfony.sprintf('The built-in tag "!%s" is not implemented.', tag), __self.parsedLineNumber + 1, value, __self.parsedFilename);
        }

        if ('' === tag || Yaml.PARSE_CUSTOM_TAGS & flags) {
            return Unescaper.unescapeDoubleQuotedString(tag);
        }

        throw new ParseException(__jymfony.sprintf('Tags support is not enabled. Enable the "Yaml.PARSE_CUSTOM_TAGS" flag to use "!%s".', tag), __self.parsedLineNumber + 1, value, __self.parsedFilename);
    }

    static evaluateBinaryScalar(scalar) {
        const parsedBinaryData = __self.parseScalar(scalar.replace(/\s/g, ''));

        if (0 !== (parsedBinaryData.length % 4)) {
            throw new ParseException(__jymfony.sprintf('The normalized base64 encoded data (data without whitespace characters) length must be a multiple of four (%d bytes given).', parsedBinaryData.length), __self.parsedLineNumber + 1, scalar, __self.parsedFilename);
        }

        if (! Parser.preg_match(/^[A-Z0-9+/]+={0,2}$/i, parsedBinaryData)) {
            throw new ParseException(__jymfony.sprintf('The base64 encoded data (%s) contains invalid characters.', parsedBinaryData), __self.parsedLineNumber + 1, scalar, __self.parsedFilename);
        }

        return Buffer.from(parsedBinaryData, 'base64').toString('utf-8');
    }

    static isBinaryString(value) {
        return !! value.match(/[^\x00\x07-\x0d\x1B\x20-\xff]/);
    }
}

Inline.REGEX_QUOTED_STRING = '^(?:"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"|\'([^\']*(?:\'\'[^\']*)*)\')';
Inline.parsedLineNumber = -1;
Inline.parsedFilename = null;
