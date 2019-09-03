declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class NullLiteral extends Literal {
        /**
         * Constructor.
         */
        __construct(location: SourceLocation): void;
        constructor(location: SourceLocation);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
