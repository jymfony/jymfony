const Dumper = Jymfony.Component.Yaml.Dumper;
const Parser = Jymfony.Component.Yaml.Parser;

/**
 * Yaml offers convenience methods to load and dump YAML.
 *
 * @memberOf Jymfony.Component.Yaml
 * @final
 */
export default class Yaml {
    /**
     * Parses a YAML file into a JSON value.
     *
     * Usage:
     *
     *     const o = Yaml.parseFile('config.yml');
     *     console.log(o);
     *
     * @param {string} filename The path to the YAML file to be parsed
     * @param {int} [flags = 0] A bit field of PARSE_* constants to customize the YAML parser behavior
     *
     * @returns {*} The YAML converted to a JSON value
     *
     * @throws {Jymfony.Component.Yaml.Exception.ParseException} If the file could not be read or the YAML is not valid
     */
    static parseFile(filename, flags = 0) {
        const yaml = new Parser();

        return yaml.parseFile(filename, flags);
    }

    /**
     * Parses YAML into a JSON value.
     *
     *  Usage:
     *  <code>
     *   const o = Yaml.parse(fs.readFileSync('config.yml'));
     *   console.log(o);
     *  </code>
     *
     * @param {string} input A string containing YAML
     * @param {int} [flags = 0] A bit field of PARSE_* constants to customize the YAML parser behavior
     *
     * @returns {*} The YAML converted to a JSON value
     *
     * @throws {Jymfony.Component.Yaml.Exception.ParseException} If the YAML is not valid
     */
    static parse(input, flags = 0) {
        const yaml = new Parser();

        return yaml.parse(input, flags);
    }

    /**
     * Dumps a JSON value to a YAML string.
     *
     * The dump method, when supplied with an array, will do its best
     * to convert the array into friendly YAML.
     *
     * @param {*} input The JSON value
     * @param {int} [inline = 2] The level where you switch to inline YAML
     * @param {int} [indent = 4] The amount of spaces to use for indentation of nested nodes
     * @param {int} [flags = 0]  A bit field of DUMP_* constants to customize the dumped YAML string
     *
     * @returns {string} A YAML string representing the original JSON value
     */
    static dump(input, inline = 2, indent = 4, flags = 0) {
        const yaml = new Dumper(indent);

        return yaml.dump(input, inline, 0, flags);
    }
}

Yaml.DUMP_OBJECT = 1;
Yaml.PARSE_EXCEPTION_ON_INVALID_TYPE = 2;
Yaml.PARSE_OBJECT = 4;
Yaml.DUMP_EXCEPTION_ON_INVALID_TYPE = 8;
Yaml.PARSE_DATETIME = 16;
Yaml.DUMP_MULTI_LINE_LITERAL_BLOCK = 32;
Yaml.PARSE_CUSTOM_TAGS = 64;
Yaml.DUMP_EMPTY_ARRAY_AS_SEQUENCE = 128;
