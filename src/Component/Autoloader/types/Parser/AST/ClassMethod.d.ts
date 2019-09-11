declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ClassMethod extends mix(Function, ClassMemberInterface) {
        public location: SourceLocation;
        public docblock: null | string;

        private _kind: 'constructor' | 'method' | 'get' | 'set';
        private _static: boolean;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(location: SourceLocation, body: BlockStatement, id: Identifier, kind: 'constructor' | 'method' | 'get' | 'set', params?: PatternInterface[], { generator, async, Static }?: { generator?: boolean, async?: boolean, Static?: boolean }): void;
        constructor(location: SourceLocation, body: BlockStatement, id: Identifier, kind: 'constructor' | 'method' | 'get' | 'set', params?: PatternInterface[], { generator, async, Static }?: { generator?: boolean, async?: boolean, Static?: boolean });

        /**
         * Gets the identifier.
         */
        public readonly id: any;

        /**
         * Gets the identifier.
         */
        public readonly kind: string;

        /**
         * Whether this method is static.
         */
        public readonly static: boolean;

        /**
         * @inheritdoc
         */
        compileDecorators(compiler: Compiler, target: Class, id: any): StatementInterface[];

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
