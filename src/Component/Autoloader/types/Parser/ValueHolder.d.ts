declare namespace Jymfony.Component.Autoloader.Parser {
    /**
     * Value holder for lexer.
     * You can modify the value into your getType implementation.
     */
    export class ValueHolder {
        public value: string;

        /**
         * Constructor.
         */
        constructor(value: any);
    }
}
