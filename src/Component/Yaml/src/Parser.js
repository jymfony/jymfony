import * as fs from 'fs';

const ParseException = Jymfony.Component.Yaml.Exception.ParseException;
const Inline = Jymfony.Component.Yaml.Inline;
const Yaml = Jymfony.Component.Yaml.Yaml;
const TaggedValue = Jymfony.Component.Yaml.Tag.TaggedValue;

const TAG_PATTERN = '(?<tag>![\\w!.\\/:\\-,]+)';
const BLOCK_SCALAR_HEADER_PATTERN = '(?<separator>\\||>)(?<modifiers>\\+|\\-|\\d+|\\+\\d+|\\-\\d+|\\d+\\+|\\d+\\-)?(?<comments> +#.*)?';

/**
 * Parser parses YAML strings to convert them to JSON objects.
 *
 * @memberOf Jymfony.Component.Yaml
 * @final
 */
export default class Parser {
    __construct() {
        /**
         * @type {string}
         *
         * @private
         */
        this._filename = undefined;

        /**
         * @type {int}
         *
         * @private
         */
        this._offset = 0;

        /**
         * @type {int}
         *
         * @private
         */
        this._totalNumberOfLines = undefined;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._lines = [];

        /**
         * @type {int}
         *
         * @private
         */
        this._currentLineNb = -1;

        /**
         * @type {string}
         *
         * @private
         */
        this._currentLine = '';

        /**
         * @type {Object.<string, *>}
         *
         * @private
         */
        this._refs = {};

        /**
         * @type {int[]}
         *
         * @private
         */
        this._skippedLineNumbers = [];

        /**
         * @type {Array}
         * @private
         */
        this._locallySkippedLineNumbers = [];

        /**
         * @type {Array}
         * @private
         */
        this._refsBeingParsed = [];
    }

    /**
     * Parses a YAML file into a JSON value.
     *
     * @param {string} filename The path to the YAML file to be parsed
     * @param {int} [flags = 0] A bit field of PARSE_* constants to customize the YAML parser behavior
     *
     * @returns {*} The YAML converted to a JSON value
     *
     * @throws {Jymfony.Component.Yaml.Exception.ParseException} If the file could not be read or the YAML is not valid
     */
    parseFile(filename, flags = 0) {
        try {
            fs.statSync(filename);
        } catch (e) {
            throw new ParseException(__jymfony.sprintf('File "%s" does not exist.', filename));
        }

        try {
            fs.accessSync(filename, fs.constants.R_OK);
        } catch (e) {
            throw new ParseException(__jymfony.sprintf('File "%s" cannot be read.', filename));
        }

        this._filename = filename;

        try {
            return this.parse(fs.readFileSync(filename), flags);
        } finally {
            this._filename = undefined;
        }
    }

    /**
     * Parses a YAML string to a JSON value.
     *
     * @param {string|Buffer} value A YAML string
     * @param {int} [flags = 0] A bit field of PARSE_* constants to customize the YAML parser behavior
     *
     * @returns {*} A JSON value
     *
     * @throws {Jymfony.Component.Yaml.Exception.ParseException} If the YAML is not valid
     */
    parse(value, flags = 0) {
        this._refs = {};
        let data = null;

        if (isBuffer(value)) {
            value = value.toString('utf-8');
        }

        try {
            data = this._doParse(value, flags);
        } finally {
            this._lines = [];
            this._currentLine = '';
            this._refs = {};
            this._skippedLineNumbers = [];
            this._locallySkippedLineNumbers = [];
        }

        return data;
    }

    /**
     * Parse file.
     *
     * @param {string} value
     * @param {int} flags
     *
     * @returns {Jymfony.Component.Yaml.Tag.TaggedValue|*}
     *
     * @private
     */
    _doParse(value, flags) {
        this._currentLineNb = -1;
        this._currentLine = '';

        value = this._cleanup(value);
        this._lines = value.split('\n');
        this._locallySkippedLineNumbers = [];

        if (undefined === this._totalNumberOfLines) {
            this._totalNumberOfLines = this._lines.length;
        }

        if (! this._moveToNextLine()) {
            return null;
        }

        let data = {};
        let context = null;
        let allowOverwrite = false;
        let tag;

        while (this._isCurrentLineEmpty()) {
            if (! this._moveToNextLine()) {
                return null;
            }
        }

        // Resolves the tag and returns if end of the document
        if (null !== (tag = this._getLineTag(this._currentLine, flags, false)) && ! this._moveToNextLine()) {
            return new TaggedValue(tag, '');
        }

        do {
            if (this._isCurrentLineEmpty()) {
                continue;
            }

            // Tab?
            if ('\t' === this._currentLine[0]) {
                throw new ParseException('A YAML file cannot contain tabs as indentation.', this._getRealCurrentLineNb() + 1, this._currentLine, this._filename);
            }

            Inline.initialize(flags, this._getRealCurrentLineNb(), this._filename);

            let mergeNode = false, isRef = false, values, subTag;
            if ('-' === this._currentLine[0] && (values = __self.preg_match(new RegExp('^\\-((?<leadspaces>\\s+)(?<value>.+))?$'), __jymfony.rtrim(this._currentLine)))) {
                if (context && 'mapping' === context) {
                    throw new ParseException('You cannot define a sequence item when in a mapping', this._getRealCurrentLineNb() + 1, this._currentLine, this._filename);
                } else if (! context) {
                    data = [];
                }

                context = 'sequence';

                let matches;
                if (values.groups.value && '&' === values.groups.value[0] && (matches = __self.preg_match(new RegExp('^&(?<ref>[^ ]+) *(?<value>.*)'), values.groups.value))) {
                    isRef = matches.groups.ref;
                    this._refsBeingParsed.push(isRef);
                    values.groups.value = matches.groups.value;
                }

                if (values.groups.value && '?' === values.groups.value[0] && ' ' === values.groups.value[1]) {
                    throw new ParseException('Complex mappings are not supported.', this._getRealCurrentLineNb() + 1, this._currentLine);
                }

                // Array
                if (! values.groups.value || '' === __jymfony.trim(values.groups.value, ' ') || 0 === __jymfony.ltrim(values.groups.value, ' ').indexOf('#')) {
                    const nextEmbedBlock = this._getNextEmbedBlock(null, true);
                    data.push(this._parseBlock(this._getRealCurrentLineNb() + 1, null !== nextEmbedBlock ? nextEmbedBlock : '', flags));
                } else if (null !== (subTag = this._getLineTag(__jymfony.ltrim(values.groups.value, ' '), flags))) {
                    const block = this._parseBlock(this._getRealCurrentLineNb() + 1, this._getNextEmbedBlock(null, true), flags);
                    data.push(new TaggedValue(subTag, block));
                } else {
                    if (
                        values.groups.leadspaces &&
                        (matches = __self.preg_match(new RegExp('^(?<key>' + Inline.REGEX_QUOTED_STRING + '|[^ \'"{[].*?) *:(\\s+(?<value>.+?))?\\s*$', 'u'), this._trimTag(values.groups.value)))
                    ) {
                        // This is a compact notation element, add to next block and parse
                        let block = values.groups.value;
                        if (this._isNextLineIndented()) {
                            block += '\n' + this._getNextEmbedBlock(this._getCurrentLineIndentation() + values.groups.leadspaces.length + 1);
                        }

                        data.push(this._parseBlock(this._getRealCurrentLineNb(), block, flags));
                    } else {
                        data.push(this._parseValue(values.groups.value, flags, context));
                    }
                }

                if (isRef) {
                    this._refs[isRef] = data[data.length - 1];
                    this._refsBeingParsed.pop();
                }
            } else if (
                (values = __self.preg_match(new RegExp('^(?<key>(?:![^\\s]+\\s+)?(?:' + Inline.REGEX_QUOTED_STRING + '|[^ \'"[{!].*?)) *:(\\s+(?<value>.+))?$', 'u'), __jymfony.rtrim(this._currentLine)))
                && (-1 === String(values.groups.key).indexOf(' #') || [ '"', '\'' ].includes(values.groups.key[0]))
            ) {
                if (context && 'sequence' === context) {
                    throw new ParseException('You cannot define a mapping item when in a sequence', this._currentLineNb + 1, this._currentLine, this._filename);
                }

                context = 'mapping';
                let key;

                try {
                    key = Inline.parseScalar(values.groups.key);
                } catch (e) {
                    if (e instanceof ParseException) {
                        e.parsedLine = this._getRealCurrentLineNb() + 1;
                        e.snippet = this._currentLine;
                    }

                    throw e;
                }

                if (! isString(key) && ! isNumeric(key)) {
                    throw new ParseException(__jymfony.sprintf('%s keys are not supported. Quote your evaluable mapping keys instead.', isNumeric(key) ? 'Numeric' : 'Non-string'), this._getRealCurrentLineNb() + 1, this._currentLine);
                }

                // Convert float keys to strings, to avoid being converted to integers by the engine
                if (isNumber(key)) {
                    key = String(key);
                }

                let refMatches, matches;
                if ('<<' === key && (undefined === values.groups.value || '&' !== values.groups.value[0] || ! (refMatches = __self.preg_match(/^&(?<ref>[^ ]+)/u, values.groups.value)))) {
                    mergeNode = true;
                    allowOverwrite = true;
                    if (values.groups.value && '*' === values.groups.value[0]) {
                        const refName = __jymfony.rtrim(values.groups.value).substr(1);
                        if (undefined === this._refs[refName]) {
                            let pos;
                            if (-1 !== (pos = this._refsBeingParsed.indexOf(refName))) {
                                throw new ParseException(__jymfony.sprintf('Circular reference [%s, %s] detected for reference "%s".', this._refsBeingParsed.slice(pos).join(', '), refName, refName), this._currentLineNb + 1, this._currentLine, this._filename);
                            }

                            throw new ParseException(__jymfony.sprintf('Reference "%s" does not exist.', refName), this._getRealCurrentLineNb() + 1, this._currentLine, this._filename);
                        }

                        const refValue = this._refs[refName];

                        if (! isObjectLiteral(refValue)) {
                            throw new ParseException('YAML merge keys used with a scalar value instead of an array.', this._getRealCurrentLineNb() + 1, this._currentLine, this._filename);
                        }

                        Object.assign(data, refValue, { ...data });
                    } else {
                        if (values.groups.value && '' !== values.groups.value) {
                            value = values.groups.value;
                        } else {
                            value = this._getNextEmbedBlock();
                        }

                        const parsed = this._parseBlock(this._getRealCurrentLineNb() + 1, value, flags);

                        if (! isArray(parsed) && ! isObjectLiteral(parsed)) {
                            throw new ParseException('YAML merge keys used with a scalar value instead of an array.', this._getRealCurrentLineNb() + 1, this._currentLine, this._filename);
                        }

                        if (undefined !== parsed[0]) {
                            // If the value associated with the merge key is a sequence, then this sequence is expected to contain mapping nodes
                            // And each of these nodes is merged in turn according to its order in the sequence. Keys in mapping nodes earlier
                            // In the sequence override keys specified in later mapping nodes.
                            for (const parsedItem of parsed) {
                                if (! isArray(parsedItem) && ! isObjectLiteral(parsedItem)) {
                                    throw new ParseException('Merge items must be arrays.', this._getRealCurrentLineNb() + 1, JSON.stringify(parsedItem), this._filename);
                                }

                                Object.assign(data, parsedItem, { ...data });
                            }
                        } else {
                            // If the value associated with the key is a single mapping node, each of its key/value pairs is inserted into the
                            // Current mapping, unless the key already exists in it.
                            Object.assign(data, parsed, { ...data });
                        }
                    }
                } else if ('<<' !== key && undefined !== values.groups.value && '&' === values.groups.value[0] && (matches = __self.preg_match(new RegExp('^&(?<ref>[^ ]+) *(?<value>.*)'), values.groups.value))) {
                    this._refsBeingParsed.push(isRef = matches.groups.ref);
                    values.groups.value = matches.groups.value;
                }

                let subTag = null;
                if (mergeNode) {
                    // Merge keys
                } else if (undefined === values.groups.value || '' === values.groups.value || 0 === values.groups.value.indexOf('#') || (null !== (subTag = this._getLineTag(values.groups.value, flags))) || '<<' === key) {
                    // Hash
                    // If next line is less indented or equal, then it means that the current value is null
                    if (! this._isNextLineIndented() && ! this._isNextLineUnIndentedCollection()) {
                        // Spec: Keys MUST be unique; first one wins.
                        // But overwriting is allowed when a merge node is used in current block.
                        if (allowOverwrite || ! data[key]) {
                            if (null !== subTag) {
                                data[key] = new TaggedValue(subTag, '');
                            } else {
                                data[key] = null;
                            }
                        } else {
                            throw new ParseException(__jymfony.sprintf('Duplicate key "%s" detected.', key), this._getRealCurrentLineNb() + 1, this._currentLine);
                        }
                    } else {
                        // Remember the parsed line number here in case we need it to provide some contexts in error messages below
                        const realCurrentLineNbKey = this._getRealCurrentLineNb();
                        value = this._parseBlock(this._getRealCurrentLineNb() + 1, this._getNextEmbedBlock(), flags);
                        if ('<<' === key) {
                            this._refs[refMatches['ref']] = value;
                            Object.assign(data, value, { ...data });
                        } else if (allowOverwrite || ! data[key]) {
                            // Spec: Keys MUST be unique; first one wins.
                            // But overwriting is allowed when a merge node is used in current block.
                            if (null !== subTag) {
                                data[key] = new TaggedValue(subTag, value);
                            } else {
                                data[key] = value;
                            }
                        } else {
                            throw new ParseException(__jymfony.sprintf('Duplicate key "%s" detected.', key), realCurrentLineNbKey + 1, this._currentLine);
                        }
                    }
                } else {
                    value = this._parseValue(values.groups.value, flags, context);
                    // Spec: Keys MUST be unique; first one wins.
                    // But overwriting is allowed when a merge node is used in current block.
                    if (allowOverwrite || ! data[key]) {
                        data[key] = value;
                    } else {
                        throw new ParseException(__jymfony.sprintf('Duplicate key "%s" detected.', key), this._getRealCurrentLineNb() + 1, this._currentLine);
                    }
                }

                if (isRef) {
                    this._refs[isRef] = data[key];
                    this._refsBeingParsed.pop();
                }
            } else {
                // Multiple documents are not supported
                if ('---' === this._currentLine) {
                    throw new ParseException('Multiple documents are not supported.', this._currentLineNb + 1, this._currentLine, this._filename);
                }

                if (!! this._currentLine[1] && '?' === this._currentLine[0] && ' ' === this._currentLine[1]) {
                    throw new ParseException('Complex mappings are not supported.', this._getRealCurrentLineNb() + 1, this._currentLine);
                }

                // 1-liner optionally followed by newline(s)
                if (isString(value) && this._lines[0] === __jymfony.trim(value)) {
                    try {
                        value = Inline.parse(this._lines[0], flags, this._refs);
                    } catch (e) {
                        if (e instanceof ParseException) {
                            e.parsedLine = this._getRealCurrentLineNb() + 1;
                            e.snippet = this._currentLine;
                        }

                        throw e;
                    }

                    return value;
                }

                // Try to parse the value as a multi-line string as a last resort
                if (0 === this._currentLineNb) {
                    let previousLineWasNewline = false;
                    let previousLineWasTerminatedWithBackslash = false;
                    value = '';

                    for (const line of this._lines) {
                        // If the indentation is not consistent at offset 0, it is to be considered as a ParseError
                        if (0 === this._offset && !! line[0] && ' ' === line[0]) {
                            throw new ParseException('Unable to parse.', this._getRealCurrentLineNb() + 1, this._currentLine, this._filename);
                        }
                        if ('' === __jymfony.trim(line)) {
                            value += '\n';
                        } else if (! previousLineWasNewline && ! previousLineWasTerminatedWithBackslash) {
                            value += ' ';
                        }

                        if ('' !== __jymfony.trim(line) && '\\' === line.substr(line.length - 1)) {
                            value += __jymfony.ltrim(line.substr(0, line.length - 1));
                        } else if ('' !== __jymfony.trim(line)) {
                            value += __jymfony.trim(line);
                        }

                        if ('' === __jymfony.trim(line)) {
                            previousLineWasNewline = true;
                            previousLineWasTerminatedWithBackslash = false;
                        } else if ('\\' === line.substr(line.length - 1)) {
                            previousLineWasNewline = false;
                            previousLineWasTerminatedWithBackslash = true;
                        } else {
                            previousLineWasNewline = false;
                            previousLineWasTerminatedWithBackslash = false;
                        }
                    }

                    try {
                        return Inline.parse(__jymfony.trim(value));
                    } catch (e) {
                        // Fall-through to the ParseException thrown below
                        if (! (e instanceof ParseException)) {
                            throw e;
                        }
                    }
                }

                throw new ParseException('Unable to parse.', this._getRealCurrentLineNb() + 1, this._currentLine, this._filename);
            }
        } while (this._moveToNextLine());

        if (null !== tag) {
            data = new TaggedValue(tag, data);
        }

        return ! data || (isArray(data) && 0 === data.length) || (isObjectLiteral(data) && 0 === Object.keys(data).length) ? null : data;
    }

    _parseBlock(offset, yaml, flags) {
        const skippedLineNumbers = this._skippedLineNumbers;

        for (const lineNumber of this._locallySkippedLineNumbers) {
            if (lineNumber < offset) {
                continue;
            }

            skippedLineNumbers.push(lineNumber);
        }

        const parser = new __self();
        parser._offset = offset;
        parser._totalNumberOfLines = this._totalNumberOfLines;
        parser._skippedLineNumbers = skippedLineNumbers;
        parser._refs = this._refs;
        parser._refsBeingParsed = [ ...this._refsBeingParsed ];

        return parser._doParse(yaml, flags);
    }

    /**
     * Returns the current line number (takes the offset into account).
     *
     * @internal
     *
     * @returns {int} The current line number
     */
    _getRealCurrentLineNb() {
        let realCurrentLineNumber = this._currentLineNb + this._offset;

        for (const skippedLineNumber of this._skippedLineNumbers) {
            if (skippedLineNumber > realCurrentLineNumber) {
                break;
            }

            ++realCurrentLineNumber;
        }

        return realCurrentLineNumber;
    }

    /**
     * Returns the current line indentation.
     *
     * @returns {int} The current line indentation
     */
    _getCurrentLineIndentation() {
        return this._currentLine.length - __jymfony.ltrim(this._currentLine, ' ').length;
    }

    /**
     * Returns the next embed block of YAML.
     *
     * @param {int|null} [indentation] The indent level at which the block is to be read, or null for default
     * @param {boolean} [inSequence = false] True if the enclosing data structure is a sequence
     *
     * @returns {null|string} A YAML string
     *
     * @throws {Jymfony.Component.Yaml.Exception.ParseException} When indentation problem are detected
     */
    _getNextEmbedBlock(indentation = null, inSequence = false) {
        const oldLineIndentation = this._getCurrentLineIndentation();

        if (! this._moveToNextLine()) {
            return null;
        }

        let newIndent;
        if (null === indentation) {
            let movements = 0, EOF;
            newIndent = null;

            do {
                EOF = false;

                // Empty and comment-like lines do not influence the indentation depth
                if (this._isCurrentLineEmpty() || this._isCurrentLineComment()) {
                    EOF = ! this._moveToNextLine();

                    if (! EOF) {
                        ++movements;
                    }
                } else {
                    newIndent = this._getCurrentLineIndentation();
                }
            } while (! EOF && null === newIndent);

            for (let i = 0; i < movements; ++i) {
                this._moveToPreviousLine();
            }

            const unindentedEmbedBlock = this._isStringUnIndentedCollectionItem();

            if (! this._isCurrentLineEmpty() && 0 === newIndent && ! unindentedEmbedBlock) {
                throw new ParseException('Indentation problem.', this._getRealCurrentLineNb() + 1, this._currentLine, this._filename);
            }
        } else {
            newIndent = indentation;
        }

        const data = [];
        if (this._getCurrentLineIndentation() >= newIndent) {
            data.push(this._currentLine.substr(newIndent));
        } else if (this._isCurrentLineEmpty() || this._isCurrentLineComment()) {
            data.push(this._currentLine);
        } else {
            this._moveToPreviousLine();

            return null;
        }

        if (inSequence && oldLineIndentation === newIndent && !! data[0] && '-' === data[0][0]) {
            // The previous line contained a dash but no item content, this line is a sequence item with the same indentation
            // And therefore no nested list or mapping
            this._moveToPreviousLine();

            return null;
        }

        const isItUnindentedCollection = this._isStringUnIndentedCollectionItem();

        while (this._moveToNextLine()) {
            const indent = this._getCurrentLineIndentation();

            if (isItUnindentedCollection && ! this._isCurrentLineEmpty() && ! this._isStringUnIndentedCollectionItem() && newIndent === indent) {
                this._moveToPreviousLine();
                break;
            }

            if (this._isCurrentLineBlank()) {
                data.push(this._currentLine.substr(newIndent));
                continue;
            }

            if (indent >= newIndent) {
                data.push(this._currentLine.substr(newIndent));
            } else if (this._isCurrentLineComment()) {
                data.push(this._currentLine);
            } else if (0 === indent) {
                this._moveToPreviousLine();

                break;
            } else {
                throw new ParseException('Indentation problem.', this._getRealCurrentLineNb() + 1, this._currentLine, this._filename);
            }
        }

        return data.join('\n');
    }

    /**
     * Moves the parser to the next line.
     *
     * @returns {boolean}
     *
     * @private
     */
    _moveToNextLine() {
        if (this._currentLineNb >= this._lines.length - 1) {
            return false;
        }

        this._currentLine = this._lines[++this._currentLineNb];

        return true;
    }

    /**
     * Moves the parser to the previous line.
     *
     * @returns {boolean}
     */
    _moveToPreviousLine() {
        if (1 > this._currentLineNb) {
            return false;
        }

        this._currentLine = this._lines[--this._currentLineNb];

        return true;
    }

    /**
     * Parses a YAML value.
     *
     * @param {string} value A YAML value
     * @param {int} flags A bit field of PARSE_* constants to customize the YAML parser behavior
     * @param {string} context The parser context (either sequence or mapping)
     *
     * @returns {*} A JSON value
     *
     * @throws {Jymfony.Component.Yaml.Exception.ParseException} When reference does not exist
     */
    _parseValue(value, flags, context) {
        if (0 === value.indexOf('*')) {
            let pos;
            if (-1 !== (pos = value.indexOf('#'))) {
                value = value.substr(1, pos - 2);
            } else {
                value = value.substr(1);
            }

            if (undefined === this._refs[value]) {
                if (-1 !== (pos = this._refsBeingParsed.indexOf(value))) {
                    throw new ParseException(__jymfony.sprintf('Circular reference [%s, %s] detected for reference "%s".', this._refsBeingParsed.slice(~~pos).join(', '), value, value), this._currentLineNb + 1, this._currentLine, this._filename);
                }

                throw new ParseException(__jymfony.sprintf('Reference "%s" does not exist.', value), this._currentLineNb + 1, this._currentLine, this._filename);
            }

            return this._refs[value];
        }

        let matches;
        if ([ '!', '|', '>' ].includes(value[0]) && (matches = __self.preg_match(new RegExp('^(?:' + TAG_PATTERN + ' +)?' + BLOCK_SCALAR_HEADER_PATTERN + '$'), value))) {
            const modifiers = (matches.groups.modifiers || '').match(/([+-])(\d+)?|(\d+)([+-])?/);

            const chomp = modifiers ? modifiers[1] || modifiers[4] || '' : '';
            const indentation = modifiers ? Number.parseInt(modifiers[2] || modifiers[3] || '0') : 0;
            const data = this._parseBlockScalar(matches.groups.separator, chomp, indentation);

            if (!! matches.groups.tag && '!' !== matches.groups.tag) {
                if ('!!binary' === matches.groups.tag) {
                    return Inline.evaluateBinaryScalar(data);
                }

                return new TaggedValue(matches.groups.tag.substr(1), data);
            }

            if ('\n' === data && '' === chomp) {
                return '';
            }

            return data;
        }

        try {
            const quotation = '' !== value && ('"' === value[0] || '\'' === value[0]) ? value[0] : null;

            // Do not take following lines into account when the current line is a quoted single line value
            if (null !== quotation && __self.preg_match(new RegExp('^' + quotation + '.*' + quotation + '(\\s*#.*)?$'), value)) {
                return Inline.parse(value, flags, this._refs);
            }

            value = __jymfony.trim(value.replace(/\s+#.*$/, ''));
            const inlineMapping = '[' === value[0] || '{' === value[0];

            const lines = [ value ];
            let indentation = null;
            value = '';

            while (this._moveToNextLine()) {
                // Unquoted strings end before the first unindented line
                if (null === quotation && 0 === this._getCurrentLineIndentation()) {
                    this._moveToPreviousLine();

                    break;
                }

                if (null === indentation) {
                    indentation = this._getCurrentLineIndentation();
                }

                lines.push(inlineMapping ? __jymfony.trim(this._currentLine) : __jymfony.rtrim(this._currentLine.substr(indentation)));

                // Quoted string values end with a line that is terminated with the quotation character
                if ('' !== this._currentLine && this._currentLine.substr(this._currentLine.length - 1) === quotation) {
                    break;
                }
            }

            for (let i = 0, linesCount = lines.length, previousLineBlank = true; i < linesCount; ++i) {
                let line = lines[i].replace(/\s+#.*/g, '');
                if ('' === line) {
                    value += '\n';
                    previousLineBlank = true;
                } else {
                    let thisLineBlank = ' ' === line[line.length - 1];
                    if ('\\' === line[line.length - 1]) {
                        line = line.substr(0, line.length - 1);
                        if (undefined !== lines[i + 1]) {
                            lines[i + 1] = __jymfony.ltrim(lines[i + 1]);
                        }

                        thisLineBlank = true;
                    }

                    if (previousLineBlank) {
                        value += line;
                        previousLineBlank = thisLineBlank;
                    } else {
                        value += ' ' + line;
                        previousLineBlank = thisLineBlank;
                    }
                }
            }

            Inline.parsedLineNumber = this._getRealCurrentLineNb();
            const parsedValue = Inline.parse(value, flags, this._refs);

            if ('mapping' === context && isString(parsedValue) && '"' !== value[0] && '\'' !== value[0] && '[' !== value[0] && '{' !== value[0] && '!' !== value[0] && -1 !== parsedValue.indexOf(': ')) {
                throw new ParseException('A colon cannot be used in an unquoted mapping value.', this._getRealCurrentLineNb() + 1, value, this._filename);
            }

            return parsedValue;
        } catch (e) {
            if (e instanceof ParseException) {
                e.parsedLine = this._getRealCurrentLineNb() + 1;
                e.snippet = this._currentLine;
            }

            throw e;
        }
    }

    /**
     * Parses a block scalar.
     *
     * @param {string} style The style indicator that was used to begin this block scalar (| or >)
     * @param {string} chomping The chomping indicator that was used to begin this block scalar (+ or -)
     * @param {int} indentation The indentation indicator that was used to begin this block scalar
     *
     * @returns {string} The text value
     */
    _parseBlockScalar(style, chomping = '', indentation = 0) {
        let notEOF = this._moveToNextLine();
        if (! notEOF) {
            return '';
        }

        let isCurrentLineBlank = this._isCurrentLineBlank();
        const blockLines = [];

        // Leading blank lines are consumed before determining indentation
        while (notEOF && isCurrentLineBlank) {
            // Newline only if not EOF
            if ((notEOF = this._moveToNextLine())) {
                blockLines.push('');
                isCurrentLineBlank = this._isCurrentLineBlank();
            }
        }

        // Determine indentation if not specified
        if (0 === indentation) {
            const currentLineLength = this._currentLine.length;

            for (let i = 0; i < currentLineLength && ' ' === this._currentLine[i]; ++i) {
                ++indentation;
            }
        }

        if (0 < indentation) {
            let matches;
            const pattern = new RegExp(__jymfony.sprintf('^ {%d}(.*)$', indentation));

            while (
                notEOF && (
                    isCurrentLineBlank ||
                    (matches = __self.preg_match(pattern, this._currentLine))
                )
            ) {
                if (isCurrentLineBlank && this._currentLine.length > indentation) {
                    blockLines.push(this._currentLine.substr(indentation));
                } else if (isCurrentLineBlank) {
                    blockLines.push('');
                } else {
                    blockLines.push(matches[1]);
                }

                // Newline only if not EOF
                if ((notEOF = this._moveToNextLine())) {
                    isCurrentLineBlank = this._isCurrentLineBlank();
                }
            }
        } else if (notEOF) {
            blockLines.push('');
        }

        if (notEOF) {
            blockLines.push('');
            this._moveToPreviousLine();
        } else if (! notEOF && ! this._isCurrentLineLastLineInDocument()) {
            blockLines.push('');
        }

        // Folded style
        let text = '';
        if ('>' === style) {
            let previousLineIndented = false;
            let previousLineBlank = false;

            for (let i = 0, blockLinesCount = blockLines.length; i < blockLinesCount; ++i) {
                if ('' === blockLines[i]) {
                    text += '\n';
                    previousLineIndented = false;
                    previousLineBlank = true;
                } else if (' ' === blockLines[i][0]) {
                    text += '\n' + blockLines[i];
                    previousLineIndented = true;
                    previousLineBlank = false;
                } else if (previousLineIndented) {
                    text += '\n' + blockLines[i];
                    previousLineIndented = false;
                    previousLineBlank = false;
                } else if (previousLineBlank || 0 === i) {
                    text += blockLines[i];
                    previousLineIndented = false;
                    previousLineBlank = false;
                } else {
                    text += ' ' + blockLines[i];
                    previousLineIndented = false;
                    previousLineBlank = false;
                }
            }
        } else {
            text = blockLines.join('\n');
        }

        // Deal with trailing newlines
        if ('' === chomping) {
            text = text.replace(/\n+$/g, '\n');
        } else if ('-' === chomping) {
            text = text.replace(/\n+$/g, '');
        }

        return text;
    }

    /**
     * Returns true if the next line is indented.
     *
     * @returns {boolean} Returns true if the next line is indented, false otherwise
     */
    _isNextLineIndented() {
        const currentIndentation = this._getCurrentLineIndentation();
        let EOF, movements = 0;

        do {
            EOF = ! this._moveToNextLine();

            if (! EOF) {
                ++movements;
            }
        } while (! EOF && (this._isCurrentLineEmpty() || this._isCurrentLineComment()));

        if (EOF) {
            return false;
        }

        const ret = this._getCurrentLineIndentation() > currentIndentation;
        for (let i = 0; i < movements; ++i) {
            this._moveToPreviousLine();
        }

        return ret;
    }

    /**
     * Returns true if the current line is blank or if it is a comment line.
     *
     * @returns {boolean} Returns true if the current line is empty or if it is a comment line, false otherwise
     *
     * @private
     */
    _isCurrentLineEmpty() {
        return this._isCurrentLineBlank() || this._isCurrentLineComment();
    }

    /**
     * Returns true if the current line is blank.
     *
     * @returns {boolean} Returns true if the current line is blank, false otherwise
     *
     * @private
     */
    _isCurrentLineBlank() {
        return '' == __jymfony.trim(this._currentLine, ' ');
    }

    /**
     * Returns true if the current line is a comment line.
     *
     * @returns {boolean} Returns true if the current line is a comment line, false otherwise
     *
     * @private
     */
    _isCurrentLineComment() {
        // Checking explicitly the first char of the trim is faster than loops or strpos
        const ltrimmedLine = __jymfony.ltrim(this._currentLine, ' ');

        return '' !== ltrimmedLine && '#' === ltrimmedLine[0];
    }

    /**
     * @returns {boolean}
     *
     * @private
     */
    _isCurrentLineLastLineInDocument() {
        return (this._offset + this._currentLineNb) >= (this._totalNumberOfLines - 1);
    }

    /**
     * Cleanups a YAML string to be parsed.
     *
     * @param {string} value The input YAML string
     *
     * @returns {string} A cleaned up YAML string
     *
     * @private
     */
    _cleanup(value) {
        value = value.replace(/\r\n?/g, '\n');

        // Strip YAML header
        let count = 0;
        value = value.replace(/^\%YAML[: ][\d\.]+.*\n/g, () => {
            count++;
            return '';
        });
        this._offset += count;

        // Remove leading comments
        count = 0;
        let trimmedValue = value.replace(/^(\#.*?\n)+/gs, () => {
            count++;
            return '';
        });

        if (1 === count) {
            // Items have been removed, update the offset
            this._offset += (value.split('\n').length - 1) - trimmedValue.split('\n').length - 1;
            value = trimmedValue;
        }

        // Remove start of the document marker (---)
        count = 0;
        trimmedValue = value.replace(/^\-\-\-.*?\n/sg, () => {
            count++;
            return '';
        });
        if (1 === count) {
            // Items have been removed, update the offset
            this._offset += (value.split('\n').length - 1) - (trimmedValue.split('\n').length - 1);
            value = trimmedValue;

            // Remove end of the document marker (...)
            value = value.replace(/\.\.\.\s*$/, '');
        }

        return value;
    }

    /**
     * Returns true if the next line starts unindented collection.
     *
     * @returns {boolean} Returns true if the next line starts unindented collection, false otherwise
     *
     * @private
     */
    _isNextLineUnIndentedCollection() {
        const currentIndentation = this._getCurrentLineIndentation();
        let EOF, movements = 0;

        do {
            EOF = ! this._moveToNextLine();

            if (! EOF) {
                ++movements;
            }
        } while (!EOF && (this._isCurrentLineEmpty() || this._isCurrentLineComment()));

        if (EOF) {
            return false;
        }

        const ret = this._getCurrentLineIndentation() === currentIndentation && this._isStringUnIndentedCollectionItem();
        for (let i = 0; i < movements; ++i) {
            this._moveToPreviousLine();
        }

        return ret;
    }

    /**
     * Returns true if the string is un-indented collection item.
     *
     * @returns {boolean} Returns true if the string is un-indented collection item, false otherwise
     *
     * @private
     */
    _isStringUnIndentedCollectionItem() {
        return '-' === __jymfony.rtrim(this._currentLine) || 0 === this._currentLine.indexOf('- ');
    }

    /**
     * A local wrapper for "preg_match" which will throw a ParseException if there
     * is an internal error in the regex engine.
     *
     * This avoids us needing to wrap the match call in a try-catch
     * in the YAML engine
     *
     * @throws {Jymfony.Component.Yaml.Exception.ParseException} on a regex error
     *
     * @returns {RegExpMatchArray|null}
     *
     * @internal
     */
    static preg_match(regexp, subject) {
        try {
            return String(subject).match(regexp);
        } catch (e) {
            throw new ParseException(e);
        }
    }

    /**
     * Trim the tag on top of the value.
     *
     * Prevent values such as "!foo {quz: bar}" to be considered as
     * a mapping block.
     *
     * @param {string} value
     *
     * @returns {string}
     *
     * @private
     */
    _trimTag(value) {
        if ('!' === value[0]) {
            return __jymfony.ltrim(value.substr(1, __jymfony.strcspn(value, ' \r\n', 1)), ' ');
        }

        return value;
    }

    /**
     * @param {string} value
     * @param {int} flags
     * @param {boolean} [nextLineCheck = true]
     *
     * @returns {null|string}
     */
    _getLineTag(value, flags, nextLineCheck = true) {
        let matches;
        if ('' === value || '!' !== value[0] || null === (matches = __self.preg_match(new RegExp('^' + TAG_PATTERN + ' *( +#.*)?$'), value))) {
            return null;
        }

        if (nextLineCheck && ! this._isNextLineIndented()) {
            return null;
        }

        const tag = matches.groups.tag.substr(1);

        // Built-in tags
        if (tag && '!' === tag[0]) {
            throw new ParseException(__jymfony.sprintf('The built-in tag "!%s" is not implemented.', tag), this._getRealCurrentLineNb() + 1, value, this._filename);
        }

        if (Yaml.PARSE_CUSTOM_TAGS & flags) {
            return tag;
        }

        throw new ParseException(__jymfony.sprintf('Tags support is not enabled. You must use the flag "Yaml.PARSE_CUSTOM_TAGS" to use "%s".', matches.groups.tag), this._getRealCurrentLineNb() + 1, value, this._filename);
    }
}
