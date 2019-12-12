declare namespace Jymfony.Component.Yaml {
    import TaggedValue = Jymfony.Component.Yaml.Tag.TaggedValue;

    /**
     * Parser parses YAML strings to convert them to JSON objects.
     *
     * @memberOf Jymfony.Component.Yaml
     * @final
     */
    export class Parser {
        private _filename: string;
        private _offset: number;
        private _totalNumberOfLines: number;
        private _lines: string[];
        private _currentLineNb: number;
        private _currentLine: string;
        private _refs: Record<string, any>;
        private _skippedLineNumbers: number[];
        private _locallySkippedLineNumbers: number[];
        private _refsBeingParsed: string[];

        __construct(): void;
        constructor();

        /**
         * Parses a YAML file into a JSON value.
         *
         * @param filename The path to the YAML file to be parsed
         * @param [flags = 0] A bit field of PARSE_* constants to customize the YAML parser behavior
         *
         * @returns The YAML converted to a JSON value
         *
         * @throws {Jymfony.Component.Yaml.Exception.ParseException} If the file could not be read or the YAML is not valid
         */
        parseFile(filename: string, flags?: number): any;

        /**
         * Parses a YAML string to a JSON value.
         *
         * @param value A YAML string
         * @param [flags = 0] A bit field of PARSE_* constants to customize the YAML parser behavior
         *
         * @returns A JSON value
         *
         * @throws {Jymfony.Component.Yaml.Exception.ParseException} If the YAML is not valid
         */
        parse(value: string|Buffer, flags?: number): any;

        /**
         * Parse file.
         */
        private _doParse(value: string, flags: number): TaggedValue|any;

        private _parseBlock(offset: number, yaml: string, flags: number): TaggedValue|any;

        /**
         * Returns the current line number (takes the offset into account).
         *
         * @returns The current line number
         */
        private _getRealCurrentLineNb(): number;

        /**
         * Returns the current line indentation.
         *
         * @returns The current line indentation
         */
        _getCurrentLineIndentation(): number;

        /**
         * Returns the next embed block of YAML.
         *
         * @param [indentation] The indent level at which the block is to be read, or null for default
         * @param [inSequence = false] True if the enclosing data structure is a sequence
         *
         * @returns A YAML string
         *
         * @throws {Jymfony.Component.Yaml.Exception.ParseException} When indentation problem are detected
         */
        private _getNextEmbedBlock(indentation?: number|null, inSequence?: boolean): null|string;

        /**
         * Moves the parser to the next line.
         *
         * @private
         */
        private _moveToNextLine(): boolean;

        /**
         * Moves the parser to the previous line.
         */
        private _moveToPreviousLine(): boolean;

        /**
         * Parses a YAML value.
         *
         * @param value A YAML value
         * @param flags A bit field of PARSE_* constants to customize the YAML parser behavior
         * @param context The parser context (either sequence or mapping)
         *
         * @returns A JSON value
         *
         * @throws {Jymfony.Component.Yaml.Exception.ParseException} When reference does not exist
         */
        private _parseValue(value: string, flags: number, context: string): any;

        /**
         * Parses a block scalar.
         *
         * @param style The style indicator that was used to begin this block scalar (| or >)
         * @param chomping The chomping indicator that was used to begin this block scalar (+ or -)
         * @param indentation The indentation indicator that was used to begin this block scalar
         *
         * @returns The text value
         */
        private _parseBlockScalar(style: string, chomping?: string, indentation?: number): string;

        /**
         * Returns true if the next line is indented.
         *
         * @returns Returns true if the next line is indented, false otherwise
         */
        private _isNextLineIndented(): boolean;

        /**
         * Returns true if the current line is blank or if it is a comment line.
         *
         * @returns Returns true if the current line is empty or if it is a comment line, false otherwise
         */
        private _isCurrentLineEmpty(): boolean;

        /**
         * Returns true if the current line is blank.
         *
         * @returns Returns true if the current line is blank, false otherwise
         */
        private _isCurrentLineBlank(): boolean;

        /**
         * Returns true if the current line is a comment line.
         *
         * @returns Returns true if the current line is a comment line, false otherwise
         */
        private _isCurrentLineComment(): boolean;

        private _isCurrentLineLastLineInDocument(): boolean;

        /**
         * Cleanups a YAML string to be parsed.
         *
         * @param value The input YAML string
         *
         * @returns A cleaned up YAML string
         */
        private _cleanup(value: string): string;

        /**
         * Returns true if the next line starts unindented collection.
         *
         * @returns Returns true if the next line starts unindented collection, false otherwise
         */
        private _isNextLineUnIndentedCollection(): boolean;

        /**
         * Returns true if the string is un-indented collection item.
         *
         * @returns Returns true if the string is un-indented collection item, false otherwise
         */
        private _isStringUnIndentedCollectionItem(): boolean;

        /**
         * A local wrapper for "preg_match" which will throw a ParseException if there
         * is an internal error in the regex engine.
         *
         * This avoids us needing to wrap the match call in a try-catch
         * in the YAML engine
         *
         * @throws {Jymfony.Component.Yaml.Exception.ParseException} on a regex error
         *
         * @internal
         */
        static preg_match(regexp: RegExp, subject: string): RegExpMatchArray | null;

        /**
         * Trim the tag on top of the value.
         *
         * Prevent values such as "!foo {quz: bar}" to be considered as
         * a mapping block.
         */
        private _trimTag(value: string): string;

        private _getLineTag(value: string, flags: number, nextLineCheck?: boolean): null | string;
    }
}
