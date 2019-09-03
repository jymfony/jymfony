declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ObjectPattern extends implementationOf(PatternInterface) {
        public location: SourceLocation;
        private _properties: AssignmentProperty[];

        /**
         * @inheritdoc
         */
        public readonly names: (Identifier|ObjectMember)[];

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, properties: AssignmentProperty[]): void;
        constructor(location: SourceLocation, properties: AssignmentProperty[]);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
