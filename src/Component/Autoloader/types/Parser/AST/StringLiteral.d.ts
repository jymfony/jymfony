declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class StringLiteral extends Literal {
        private _value: string;

        /**
         * Gets the string literal value.
         */
        public readonly value: string;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(location: SourceLocation, value: string): void;
        constructor(location: SourceLocation, value: string);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
