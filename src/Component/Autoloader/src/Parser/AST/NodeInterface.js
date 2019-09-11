/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class NodeInterface {
    /**
     * Compiles a node.
     *
     * @param {Jymfony.Component.Autoloader.Parser.Compiler} compiler
     *
     * @returns
     */
    compile(compiler) { }
}

module.exports = getInterface(NodeInterface);
