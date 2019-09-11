declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class VariableDeclarator extends implementationOf(NodeInterface) {
        public location: SourceLocation;
        private _id: PatternInterface;
        private _init: null | ExpressionInterface;

        /**
         * Gets the id.
         */
        public readonly id: PatternInterface;

        /**
         * Gets the init value.
         */
        public readonly init: null | ExpressionInterface;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, id: PatternInterface, init?: null | ExpressionInterface): void;
        constructor(location: SourceLocation, id: PatternInterface, init?: null | ExpressionInterface);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
