const Base64VLQ = require('./Base64VLQ');
const Mapping = require('./Mapping');
const MappingList = require('./MappingList');

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally.
 *
 * @memberOf Jymfony.Component.Autoloader.Parser.SourceMap
 */
class Generator {
    /**
     * Constructor.
     *
     * @param {null|string} [file] The filename of the source.
     * @param {null|string} [sourceRoot]  A root for all relative paths in this source map.
     * @param {boolean} [skipValidation = false]
     */
    constructor({ file = null, skipValidation = false } = {}) {
        /**
         * @type {string}
         *
         * @private
         */
        this._file = file;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._skipValidation = skipValidation;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.SourceMap.MappingList}
         *
         * @private
         */
        this._mappings = new MappingList();

        /**
         * @type {null|string}
         *
         * @private
         */
        this._sourceContent = null;
    }

    /**
     * Add a single mapping from original source line and column to the generated
     * source's line and column for this source map being created.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.Position} generated Generated line and column positions.
     * @param {null|Jymfony.Component.Autoloader.Parser.AST.Position} [original] Original line and column positions.
     */
    addMapping({ generated, original = null }) {
        if (! this._skipValidation) {
            Generator._validateMapping(generated, original);
        }

        if (null === original) {
            this._mappings.add(new Mapping(generated));
        } else {
            this._mappings.add(new Mapping(generated, original, this._file));
        }
    }

    /**
     * Set the source content for a source file.
     */
    set sourceContent(content) {
        this._sourceContent = !! content ? String(content) : null;
    }

    /**
     * A mapping can have one of the three levels of data:
     *
     *   1. Just the generated position.
     *   2. The Generated position, original position, and original source.
     *   3. Generated and original position, original source, as well as a name
     *      token.
     *
     * To maintain consistency, we validate that any new mapping being added falls
     * in to one of these categories.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.Position} generated
     * @param {Jymfony.Component.Autoloader.Parser.AST.Position} original
     */
    static _validateMapping(generated, original) {
        if (original && (! isNumber(original.line) || ! isNumber(original.column))) {
            throw new Error(
                'original.line and original.column are not numbers -- you probably meant to omit ' +
                'the original mapping entirely and only map the generated position. If so, pass ' +
                'null for the original mapping instead of an object with empty or null values.'
            );
        }

        if (generated && 'line' in generated && 'column' in generated
            && 0 < generated.line && 0 <= generated.column && ! original) {
            // Case 1.
        } else if (generated && 'line' in generated && 'column' in generated
            && original && 'line' in original && 'column' in original
            && 0 < generated.line && 0 <= generated.column
            && 0 < original.line && 0 <= original.column) {
            // Cases 2 and 3.
        } else {
            throw new Error('Invalid mapping: ' + JSON.stringify({ generated, original }));
        }
    }

    /**
     * Serialize the accumulated mappings in to the stream of base 64 VLQs
     * specified by the source map format.
     */
    _serializeMappings() {
        let previousGeneratedColumn = 0;
        let previousGeneratedLine = 1;
        let previousOriginalColumn = 0;
        let previousOriginalLine = 0;
        let previousSource = 0;
        let result = '';
        let next;
        let mapping;
        let sourceIdx;

        const mappings = this._mappings.toArray();
        for (let i = 0, len = mappings.length; i < len; i++) {
            mapping = mappings[i];
            next = '';

            if (mapping.generatedLine !== previousGeneratedLine) {
                previousGeneratedColumn = 0;
                while (mapping.generatedLine !== previousGeneratedLine) {
                    next += ';';
                    previousGeneratedLine++;
                }
            } else if (0 < i) {
                if (0 === mapping.compareByGeneratedPositionsInflated(mappings[i - 1])) {
                    continue;
                }

                next += ',';
            }

            next += Base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
            previousGeneratedColumn = mapping.generatedColumn;

            if (null != mapping.source) {
                sourceIdx = 0;
                next += Base64VLQ.encode(sourceIdx - previousSource);
                previousSource = sourceIdx;

                // Lines are stored 0-based in SourceMap spec version 3
                next += Base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
                previousOriginalLine = mapping.originalLine - 1;

                next += Base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
                previousOriginalColumn = mapping.originalColumn;
            }

            result += next;
        }

        return result;
    }

    /**
     * Externalize the source map.
     */
    toJSON() {
        const map = {
            version: 3,
            sources: [ this._file ],
            mappings: this._serializeMappings(),
        };

        if (null != this._file) {
            map.file = this._file;
        }

        if (this._sourceContent) {
            map.sourcesContent = [ this._sourceContent ];
        }

        return map;
    }

    /**
     * Render the source map being generated to a string.
     */
    toString() {
        return JSON.stringify(this.toJSON());
    }
}

module.exports = Generator;
