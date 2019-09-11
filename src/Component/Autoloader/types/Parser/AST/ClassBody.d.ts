declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class ClassBody extends implementationOf(NodeInterface) {
        public location: SourceLocation;
        private _body: ClassMemberInterface[];

        /**
         * Gets class member array.
         * Not a shallow copy.
         */
        public readonly members: ClassMemberInterface[];

        /**
         * Constructor.
         */
        __construct(location: SourceLocation, body: ClassMemberInterface[]): void;
        constructor(location: SourceLocation, body: ClassMemberInterface[]);

        /**
         * Adds a class member.
         */
        addMember(member: ClassMemberInterface): void;

        /**
         * @inheritdoc
         */
        compile(compiler: Compiler): void;
    }
}
