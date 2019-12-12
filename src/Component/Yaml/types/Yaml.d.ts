declare namespace Jymfony.Component.Yaml {
    /**
     * Yaml offers convenience methods to load and dump YAML.
     *
     * @final
     */
    export class Yaml {
        public static readonly DUMP_OBJECT = 1;
        public static readonly PARSE_EXCEPTION_ON_INVALID_TYPE = 2;
        public static readonly PARSE_OBJECT = 4;
        public static readonly DUMP_EXCEPTION_ON_INVALID_TYPE = 8;
        public static readonly PARSE_DATETIME = 16;
        public static readonly DUMP_MULTI_LINE_LITERAL_BLOCK = 32;
        public static readonly PARSE_CUSTOM_TAGS = 64;
        public static readonly DUMP_EMPTY_ARRAY_AS_SEQUENCE = 128;

        /**
         * Parses a YAML file into a JSON value.
         *
         * Usage:
         *
         *     const o = Yaml.parseFile('config.yml');
         *     console.log(o);
         *
         * @param filename The path to the YAML file to be parsed
         * @param [flags = 0] A bit field of PARSE_* constants to customize the YAML parser behavior
         *
         * @returns The YAML converted to a JSON value
         *
         * @throws {Jymfony.Component.Yaml.Exception.ParseException} If the file could not be read or the YAML is not valid
         */
        static parseFile(filename: string, flags?: number): any;

        /**
         * Parses YAML into a JSON value.
         *
         *  Usage:
         *  <code>
         *   const o = Yaml.parse(fs.readFileSync('config.yml'));
         *   console.log(o);
         *  </code>
         *
         * @param input A string containing YAML
         * @param [flags = 0] A bit field of PARSE_* constants to customize the YAML parser behavior
         *
         * @returns The YAML converted to a JSON value
         *
         * @throws {Jymfony.Component.Yaml.Exception.ParseException} If the YAML is not valid
         */
        static parse(input: string, flags?: number): any;

        /**
         * Dumps a JSON value to a YAML string.
         *
         * The dump method, when supplied with an array, will do its best
         * to convert the array into friendly YAML.
         *
         * @param input The JSON value
         * @param [inline = 2] The level where you switch to inline YAML
         * @param [indent = 4] The amount of spaces to use for indentation of nested nodes
         * @param [flags = 0]  A bit field of DUMP_* constants to customize the dumped YAML string
         *
         * @returns A YAML string representing the original JSON value
         */
        static dump(input: any, inline?: number, indent?: number, flags?: number): string;
    }
}
