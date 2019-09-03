declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ExportNamedDeclaration extends implementationOf(ModuleDeclarationInterface) {
        public location: SourceLocation;
        public docblock: null | string;
        public decorators: null | AppliedDecorator[];

        private _declarations: VariableDeclaration;
        private _specifiers: ExportSpecifier[];
        private _source: Literal;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, declarations: VariableDeclaration, specifiers: ExportSpecifier[], source: Literal): void;
        constructor(location: SourceLocation, declarations: VariableDeclaration, specifiers: ExportSpecifier[], source: Literal);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;

        /**
         * Compile a declarator export.
         */
        private static _exportDeclarator(compiler: Compiler, declarator: VariableDeclarator): void;
    }
}
