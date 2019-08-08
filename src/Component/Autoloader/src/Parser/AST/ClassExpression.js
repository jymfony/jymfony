const Class = require('./Class');
const ExpressionInterface = require('./ExpressionInterface');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ClassExpression extends mix(Class, ExpressionInterface) {
}

module.exports = ClassExpression;
