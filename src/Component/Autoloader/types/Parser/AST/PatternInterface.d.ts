declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class PatternInterface extends NodeInterface.definition implements MixinInterface {
        public static readonly definition: Newable<PatternInterface>;

        /**
         * Gets the names defined in pattern (or children subpatterns).
         */
        public readonly names: (Identifier|ObjectMember)[];
    }
}
