declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class RestElement extends implementationOf(PatternInterface) {
        public location: SourceLocation;
        private _argument: PatternInterface;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, argument: PatternInterface): void;
        constructor(location: SourceLocation, argument: PatternInterface);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;

        /**
         * The rest argument.
         */
        public readonly argument: PatternInterface;
    }
}
