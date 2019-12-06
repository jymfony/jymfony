declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class RegisterDecorator extends AppliedDecorator {
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
        apply(compiler: Compiler, class_: Class, target: Class|ClassMemberInterface, variable: string): StatementInterface[];

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler, class_?: Class, target?: Class|ClassMemberInterface): StatementInterface[];
    }
}
