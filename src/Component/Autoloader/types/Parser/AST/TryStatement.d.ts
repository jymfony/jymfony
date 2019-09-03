declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class TryStatement extends implementationOf(StatementInterface) {
        public location: SourceLocation;

        private _block: BlockStatement;
        private _handler: CatchClause;
        private _finalizer: BlockStatement;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, block: BlockStatement, handler: CatchClause, finalizer: BlockStatement): void;
        constructor(location: SourceLocation, block: BlockStatement, handler: CatchClause, finalizer: BlockStatement);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
