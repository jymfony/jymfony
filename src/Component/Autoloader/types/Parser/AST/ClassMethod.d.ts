declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ClassMethod extends mix(Function, ClassMemberInterface) {
        public location: SourceLocation;
        public docblock: null | string;

        private _kind: 'constructor' | 'method' | 'get' | 'set';
        private _static: boolean;
        private _private: boolean;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(location: SourceLocation, body: BlockStatement, id: Identifier, kind: 'constructor' | 'method' | 'get' | 'set', params?: PatternInterface[], { generator, async, Private,  Static }?: { generator?: boolean, async?: boolean, Private?: boolean, Static?: boolean }): void;
        constructor(location: SourceLocation, body: BlockStatement, id: Identifier, kind: 'constructor' | 'method' | 'get' | 'set', params?: PatternInterface[], { generator, async, Private, Static }?: { generator?: boolean, async?: boolean, Private?: boolean, Static?: boolean });

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
         * Whether this method is private.
         */
        public readonly private: boolean;

        /**
         * @inheritdoc
         */
        compileDecorators(compiler: Compiler, target: Class): StatementInterface[];

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
