declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class BlockStatement extends implementationOf(StatementInterface) {
        public location: SourceLocation;
        private _body: StatementInterface[];

        /**
         * Gets the block statements array.
         */
        public readonly statements: StatementInterface[];

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, body: StatementInterface[]): void;
        constructor(location: SourceLocation, body: StatementInterface[]);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
