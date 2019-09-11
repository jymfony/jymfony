declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class InitializeDecorator extends AppliedDecorator {
        /**
         * Gets the mangled name of the callback.
         */
        public readonly mangledName: string;

        /**
         * Gets the callback expression.
         */
        public readonly callback: Function;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(location: SourceLocation, callback: Function): void;
        constructor(location: SourceLocation, callback: Function);

        /**
         * @inheritdoc
         */
        apply(compiler: Compiler, target: Class, id: [Identifier, ExpressionInterface], variable: string): StatementInterface[];

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler, target: Class, id: [Identifier, ExpressionInterface]): StatementInterface[];

        /**
         * Applies the decorator adding function call to constructor.
         */
        _addToConstructor(target: Class, id: [Identifier, ExpressionInterface], callee: Identifier): void;
    }
}
