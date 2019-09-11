declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class Identifier extends implementationOf(NodeInterface, ExpressionInterface, PatternInterface) {
        public location: SourceLocation;
        public docblock: string | null;
        private _name: string;

        /**
         * Gets the identifier name.
         */
        public readonly name: string;

        /**
         * @inheritdoc
         */
        public readonly names: (Identifier|ObjectMember)[];

        /**
         * Whether this identifier is a decorator name.
         */
        public readonly isDecoratorIdentifier: boolean;

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, name: string): void;
        constructor(location: SourceLocation, name: string);

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
