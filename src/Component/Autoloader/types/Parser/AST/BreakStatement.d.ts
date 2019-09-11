declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class BreakStatement extends implementationOf(StatementInterface) {
        public location: SourceLocation;
        private _label: null | Identifier;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, label: null | Identifier): void;
        constructor(location: SourceLocation, label: null | Identifier);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
