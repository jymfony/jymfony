const ExpressionInterface = require('./ExpressionInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class Literal extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     */
    __construct(location) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;
    }
}

module.exports = Literal;
