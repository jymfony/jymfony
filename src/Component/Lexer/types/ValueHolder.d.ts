declare namespace Jymfony.Component.Lexer {
    import ValueHolderInterface = Jymfony.Contracts.Lexer.ValueHolderInterface;

    /**
     * Value holder for lexer.
     * You can modify the value into your getType implementation.
     */
    export class ValueHolder extends implementationOf(ValueHolderInterface) {
        private _value: any;

        /**
         * Constructor.
         */
        __construct(value: any): void;
        constructor(value: any);

        public value: any;
    }
}
