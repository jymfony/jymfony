const NodeInterface = require('./NodeInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class PatternInterface extends NodeInterface.definition {
    /**
     * Gets the names defined in pattern (or children subpatterns)
     *
     * @returns {(Jymfony.Component.Autoloader.Parser.AST.Identifier|Jymfony.Component.Autoloader.Parser.AST.ObjectMember)[]}
     */
    get names() { }
}

module.exports = getInterface(PatternInterface);
