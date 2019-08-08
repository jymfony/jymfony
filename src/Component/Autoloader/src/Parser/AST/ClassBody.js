const NodeInterface = require('./NodeInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ClassBody extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ClassMemberInterface[]} body
     */
    __construct(location, body) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ClassMemberInterface[]}
         *
         * @private
         */
        this._body = body;
    }

    /**
     * Gets class member array.
     * Not a shallow copy.
     *
     * @return {Jymfony.Component.Autoloader.Parser.AST.ClassMemberInterface[]}
     */
    get members() {
        return this._body;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        for (const member of this._body) {
            compiler.compileNode(member);
            compiler._emit('\n');
        }
    }
}

module.exports = ClassBody;
