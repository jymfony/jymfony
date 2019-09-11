declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class Comment extends implementationOf(NodeInterface) {
        public location: SourceLocation;
        private _value: string;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, value: string): void;
        constructor(location: SourceLocation, value: string);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
