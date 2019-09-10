declare namespace Jymfony.Component.Yaml {
    /**
     * Escaper encapsulates escaping rules for single and double-quoted
     * YAML strings.
     *
     * @memberOf Jymfony.Component.Yaml
     * @internal
     */
    export class Escaper {
        /**
         * Determines if a JSON value would require double quoting in YAML.
         *
         * @param value A JSON value
         *
         * @returns True if the value would require double quotes
         */
        static requiresDoubleQuoting(value: string): boolean;

        /**
         * Escapes and surrounds a JSON value with double quotes.
         *
         * @param value A JSON value
         *
         * @returns The quoted, escaped string
         */
        static escapeWithDoubleQuotes(value: string): string;

        /**
         * Determines if a JSON value would require single quoting in YAML.
         *
         * @param value A JSON value
         *
         * @returns True if the value would require single quotes
         */
        static requiresSingleQuoting(value: string): boolean;

        /**
         * Escapes and surrounds a JSON value with single quotes.
         *
         * @param value A JSON value
         *
         * @returns The quoted, escaped string
         */
        static escapeWithSingleQuotes(value: string): string;
    }
}
