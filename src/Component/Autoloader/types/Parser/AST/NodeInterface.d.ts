declare namespace Jymfony.Component.Autoloader.Parser.AST {
    export class NodeInterface implements MixinInterface {
        public static readonly definition: Newable<NodeInterface>;

        /**
         * Compiles a node.
         */
        compile(compiler: Compiler): void;
    }
}
