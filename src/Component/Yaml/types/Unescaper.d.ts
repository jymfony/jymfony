declare namespace Jymfony.Component.Yaml {
    /**
     * Unescaper encapsulates unescaping rules for single and double-quoted
     * YAML strings.
     *
     * @internal
     */
    export class Unescaper {
        /**
         * Unescapes a single quoted string.
         *
         * @param value A single quoted string
         *
         * @returns The unescaped string
         */
        static unescapeSingleQuotedString(value: string): string;

        /**
         * Unescapes a double quoted string.
         *
         * @param value A double quoted string
         *
         * @returns The unescaped string
         */
        static unescapeDoubleQuotedString(value: string): string;

        /**
         * Unescapes a character that was found in a double-quoted string.
         *
         * @param value An escaped character
         *
         * @returns The unescaped character
         */
        static unescapeCharacter(value: string): string;
    }
}
