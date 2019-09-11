declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class BooleanLiteral extends Literal {
        private _value: boolean;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(location: SourceLocation, value: boolean): void;
        constructor(location: SourceLocation, value: boolean);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
