declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class VariableDeclaration extends implementationOf(DeclarationInterface) {
        public location: SourceLocation;
        public docblock: null | string;

        private _kind: 'const' | 'let' | 'var';
        private _declarators: VariableDeclarator[];

        /**
         * Gets the variable declarators.
         */
        public readonly declarators: void;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, kind: 'const' | 'let' | 'var', declarators: VariableDeclarator[]): void;
        constructor(location: SourceLocation, kind: 'const' | 'let' | 'var', declarators: VariableDeclarator[]);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
