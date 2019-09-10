declare namespace Jymfony.Component.Yaml {
    import ValueHolder = Jymfony.Component.Yaml.Internal.ValueHolder;

    /**
     * Inline implements a YAML parser/dumper for the YAML inline syntax.
     *
     * @memberOf Jymfony.Component.Yaml
     * @internal
     */
    export class Inline {
        public static readonly REGEX_QUOTED_STRING: string;
        public static readonly parsedLineNumber: number;
        public static readonly parsedFilename: number;

        static initialize(flags: number, parsedLineNumber?: null | number, parsedFilename?: null | string): void;

        /**
         * Converts a YAML string to a JSON value.
         *
         * @param [value] A YAML string
         * @param [flags] A bit field of PARSE_* constants to customize the YAML parser behavior
         * @param [references] Mapping of variable names to values
         *
         * @returns A JSON value
         *
         * @throws {Jymfony.Component.Yaml.Exception.ParseException}
         */
        static parse(value?: string, flags?: number, references?: any): any;

        /**
         * Dumps a given JS variable to a YAML string.
         *
         * @param value The JS variable to convert
         * @param flags A bit field of Yaml::DUMP_* constants to customize the dumped YAML string
         *
         * @returns The YAML string representing the JSON value
         *
         * @throws {Jymfony.Component.Yaml.Exception.DumpException} When trying to dump JS resource
         */
        static dump(value: any, flags?: number): string;

        /**
         * Dumps a JS array to a YAML string.
         *
         * @param value The JSON array to dump
         * @param flags A bit field of Yaml.DUMP_* constants to customize the dumped YAML string
         *
         * @returns The YAML string representing the JS array
         */
        static dumpArray(value: any[], flags: number): string;

        /**
         * Dumps a JS object to a YAML string.
         *
         * @param value The JSON object to dump
         * @param flags A bit field of Yaml.DUMP_* constants to customize the dumped YAML string
         *
         * @returns The YAML string representing the JS array
         */
        static dumpHash(value: any, flags: number): string;

        /**
         * Parses a YAML scalar.
         *
         * @throws {Jymfony.Component.Yaml.Exception.DumpException} When malformed inline YAML string is parsed
         */
        static parseScalar(scalar: any, flags?: number, delimiters?: null | string[], i?: ValueHolder<number>, evaluate?: boolean, references?: any): any;

        /**
         * Parses a YAML quoted scalar.
         *
         * @throws {Jymfony.Component.Yaml.Exception.ParseException} When malformed inline YAML string is parsed
         */
        static parseQuotedScalar(scalar: any, i: ValueHolder<number>): any;

        /**
         * Parses a YAML sequence.
         *
         * @throws {Jymfony.Component.Yaml.Exception.ParseException} When malformed inline YAML string is parsed
         */
        static parseSequence(sequence: string, flags: number, i?: ValueHolder<number>, references?: any): any[];

        /**
         * Parses a YAML mapping.
         *
         * @throws {Jymfony.Component.Yaml.Exception.ParseException} When malformed inline YAML string is parsed
         */
        static parseMapping(mapping: string, flags: number, i?: ValueHolder<number>, references?: any): any;

        /**
         * Evaluates scalars and replaces magic values.
         *
         * @returns The evaluated YAML string
         *
         * @throws {Jymfony.Component.Yaml.Exception.ParseException} when object parsing support was disabled and the parser detected a JS object or when a reference could not be resolved
         */
        static evaluateScalar(scalar: string, flags: number, references?: any): any;

        static parseTag(value: string, i: ValueHolder<number>, flags: number): null | any;

        static evaluateBinaryScalar(scalar: any): string;

        static isBinaryString(value: string): boolean;
    }
}
