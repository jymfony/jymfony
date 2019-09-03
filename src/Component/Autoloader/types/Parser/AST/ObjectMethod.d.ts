declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ObjectMethod extends mix(Function, ObjectMember) {
        public docblock: null | string;
        private _kind: 'method' | 'get' | 'set';

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(location: SourceLocation, body: BlockStatement, id: Identifier, kind: 'method' | 'get' | 'set', params?: PatternInterface[], { generator, async }?: { generator: boolean, async: boolean }): void;
        constructor(location: SourceLocation, body: BlockStatement, id: Identifier, kind: 'method' | 'get' | 'set', params?: PatternInterface[], { generator, async }?: { generator: boolean, async: boolean });

        /**
         * Gets the identifier.
         */
        public readonly id: Identifier;

        /**
         * Gets the identifier.
         *
         * @returns {string}
         */
        public readonly kind: 'method' | 'get' | 'set';

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
