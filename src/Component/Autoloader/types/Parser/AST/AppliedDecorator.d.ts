declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class AppliedDecorator extends implementationOf(NodeInterface) {
        public location: SourceLocation;
        private _decorator: DecoratorDescriptor;
        private _args: ExpressionInterface[];
        private _mangled: string;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, decorator: DecoratorDescriptor, args: ExpressionInterface[]): void;
        constructor(location: SourceLocation, decorator: DecoratorDescriptor, args: ExpressionInterface[]);

        /**
         * Gets the decorator descriptor.
         */
        public readonly decorator: DecoratorDescriptor;

        /**
         * Gets the mangled name of the callback.
         */
        public readonly mangledName: string;

        /**
         * Gets the callback expression.
         */
        public readonly callback: Function;

        /**
         * Gets the arguments of the applied decorator.
         */
        public readonly args: ExpressionInterface[];

        /**
         * Generates code for decorator application.
         */
        apply(compiler: Compiler, target: Class, id: [Identifier, ExpressionInterface], variable: string): StatementInterface[];

        /**
         * Compiles a decorator.
         */
        compile(compiler: Compiler, target?: Class, id?: [Identifier, ExpressionInterface]): StatementInterface[];
    }
}
