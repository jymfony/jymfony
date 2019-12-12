declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class AppliedDecorator extends implementationOf(NodeInterface) {
        public location: SourceLocation;
        protected _mangled: string;
        private _decorator: DecoratorDescriptor;
        private _args: ExpressionInterface[];

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
         * Gets the priority of the decorator.
         * Used to indicate which decorator should be compiled first.
         */
        public readonly priority: number;

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
        apply(compiler: Compiler, class_: Class, target: Class|ClassMemberInterface, variable: string): StatementInterface[];

        /**
         * Compiles a decorator.
         */
        compile(compiler: Compiler, class_?: Class, target?: Class|ClassMemberInterface): StatementInterface[];
    }
}
