/// <reference lib="es2018.regexp" />

declare namespace Jymfony.Component.HttpFoundation {
    export class HeaderUtils {
        /**
         * Joins an object into a string for use in an HTTP header.
         */
        static toString(obj: Record<string, string>, separator: string): string;

        /**
         * Splits an HTTP header by one or more separators.
         *
         * @param header HTTP header value
         * @param separators List of characters to split on, ordered by
         *                   precedence, e.g. ",", ";=", or ",;="
         *
         * @returns Nested array with as many levels as there are characters in separators
         */
        static split(header: string, separators: string): any[];

        /**
         * Decodes a quoted string.
         *
         * If passed an unquoted string that matches the "token" construct (as
         * defined in the HTTP specification), it is passed through verbatimly.
         */
        static unquote(s: string): string;

        /**
         * Combines an array of arrays into one object.
         *
         * Each of the nested arrays should have one or two elements. The first
         * value will be used as the keys in the associative array, and the second
         * will be used as the values, or true if the nested array only contains one
         * element. Object keys are lowercased.
         *
         * Example:
         *
         *     HeaderUtils.combine([["foo", "abc"], ["bar"]])
         *     // => {"foo": "abc", "bar": true}
         *
         * @param {Array} parts
         *
         * @returns {Object}
         */
        static combine(parts: any[]): Record<string, any>;

        private static _groupParts(matches: RegExpMatchArray[], separators: string): any[];
    }
}
