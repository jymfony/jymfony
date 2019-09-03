declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class LabeledStatement extends implementationOf(StatementInterface) {
        public location: SourceLocation;

        private _label: Identifier;
        private _statement: StatementInterface;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, label: Identifier, statement: StatementInterface): void;
        constructor(location: SourceLocation, label: Identifier, statement: StatementInterface);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
