declare namespace Jymfony.Component.Lexer {
    /**
     * Value holder for lexer.
     * You can modify the value into your getType implementation.
     */
    export class ValueHolder {
        private _value: any;

        /**
         * Constructor.
         */
        __construct(value: any): void;
        constructor(value: any);

        public value: any;
    }
}
