declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class DecoratorDescriptor extends implementationOf(NodeInterface) {
        public location: SourceLocation;
        private _name: Identifier;
        private _args: PatternInterface[];
        private _decorators: AppliedDecorator[];
        private _mangled: string;

        /**
         * Gets the decorator name.
         */
        public readonly name: Identifier;

        /**
         * Gets the mangled name of the callback.
         */
        public readonly mangledName: string;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, name: Identifier, args: PatternInterface[], decorators: AppliedDecorator[]): void;
        constructor(location: SourceLocation, name: Identifier, args: PatternInterface[], decorators: AppliedDecorator[]);

        /**
         * Generates code for decorator application.
         */
        apply(compiler: Compiler, class_: Class, target: Class|ClassMemberInterface, variable: string): StatementInterface[];

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
