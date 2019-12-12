const NodeInterface = require('./NodeInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ClassMemberInterface extends NodeInterface.definition {
    /**
     * Compiles the decorators.
     * Code to be appended should be returned as an array of statements.
     *
     * @param {Jymfony.Component.Autoloader.Parser.Compiler} compiler
     * @param {Jymfony.Component.Autoloader.Parser.AST.Class} target
     * @param {Jymfony.Component.Autoloader.Parser.AST.Identifier} id
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.StatementInterface[]}
     */
    compileDecorators(compiler, target) { }
}

module.exports = getInterface(ClassMemberInterface);
