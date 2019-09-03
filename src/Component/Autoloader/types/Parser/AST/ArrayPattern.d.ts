declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ArrayPattern extends implementationOf(PatternInterface) {
        public location: SourceLocation;
        private _elements: PatternInterface[];

        /**
         * @inheritdoc
         */
        public readonly names: (Identifier|ObjectMember)[];

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, elements: PatternInterface[]): void;
        constructor(location: SourceLocation, elements: PatternInterface[]);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
