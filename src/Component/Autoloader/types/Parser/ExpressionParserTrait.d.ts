declare namespace Jymfony.Component.Autoloader.Parser {
    import ArrowFunctionExpression = Jymfony.Component.Autoloader.Parser.AST.ArrowFunctionExpression;
    import ExpressionInterface = Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface;
    import ObjectExpression = Jymfony.Component.Autoloader.Parser.AST.ObjectExpression;
    import ObjectMethod = Jymfony.Component.Autoloader.Parser.AST.ObjectMethod;

    class ExpressionParserTrait implements MixinInterface {
        public static readonly definition: Newable<ExpressionParserTrait>;

        /**
         * Is next token the start of an arrow function expression?
         */
        private _isArrowFunctionExpression(): boolean;

        /**
         * Parses an arrow function expression.
         */
        private _parseArrowFunctionExpression(): ArrowFunctionExpression;

        /**
         * Parses a literal object expression.
         */
        private _parseObjectExpression(): ObjectExpression;

        /**
         * Parses an object method.
         */
        private _parseObjectMethod(start: ParserPosition, id: null | ExpressionInterface, kind: 'method' | 'get' | 'set', opts: { async?: boolean, generator?: boolean }): ObjectMethod;

        /**
         * Parses an expression.
         */
        private _parseExpression({ maxLevel, pattern }?: { maxLevel?: number, pattern?: boolean }): ExpressionInterface;
        private _parseExpressionStage1(start: ParserPosition, maxLevel: number): ExpressionInterface;
    }
}
