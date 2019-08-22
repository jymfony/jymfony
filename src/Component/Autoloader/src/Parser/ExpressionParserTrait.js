const Lexer = require('./Lexer');
const AST = require('./AST');
const NotARegExpException = require('./Exception/NotARegExpException');

class ExpressionParserTrait {
    _isArrowFunctionExpression() {
        const state = this.state;

        try {
            if (this._lexer.isToken(Lexer.T_ASYNC)) {
                this._next();
            }

            if ([ Lexer.T_IDENTIFIER, Lexer.T_YIELD, Lexer.T_SET, Lexer.T_GET, Lexer.T_DECORATOR, Lexer.T_ARGUMENTS ].includes(this._lexer.token.type)) {
                this._next();

                return this._lexer.isToken(Lexer.T_ARROW);
            }

            if (this._lexer.isToken(Lexer.T_OPEN_PARENTHESIS)) {
                let level = 1;
                while (0 !== level && this._lexer.moveNext()) {
                    if (this._lexer.isToken(Lexer.T_OPEN_PARENTHESIS)) {
                        level++;
                    } else if (this._lexer.isToken(Lexer.T_CLOSED_PARENTHESIS)) {
                        level--;
                    }
                }

                this._next();

                return this._lexer.isToken(Lexer.T_ARROW);
            }

            return false;
        } finally {
            this.state = state;
        }
    }

    _parseArrowFunctionExpression() {
        let functionDocblock = this._pendingDocblock, argumentDocblock = functionDocblock;
        this._pendingDocblock = undefined;

        const start = this._getCurrentPosition();
        const _async = this._lexer.isToken(Lexer.T_ASYNC);
        if (_async) {
            argumentDocblock = undefined;
            this._next();
        }

        let args;
        if ([ Lexer.T_IDENTIFIER, Lexer.T_YIELD, Lexer.T_SET, Lexer.T_GET, Lexer.T_DECORATOR, Lexer.T_ARGUMENTS ].includes(this._lexer.token.type)) {
            const argument = this._parseIdentifier();
            this._skipSpaces();
            if (argumentDocblock) {
                argument.docblock = argumentDocblock;
                functionDocblock = undefined;
            }

            args = [ argument ];
        } else {
            args = this._parseFormalParametersList();
        }

        this._expect(Lexer.T_ARROW);
        this._next();
        const body = this._lexer.isToken(Lexer.T_CURLY_BRACKET_OPEN) ? this._parseStatement() : this._parseExpression({ maxLevel: 2 });

        const expression = new AST.ArrowFunctionExpression(this._makeLocation(start), body, null, args, { async: _async });
        expression.docblock = functionDocblock || null;

        return expression;
    }

    /**
     * Parses a literal object expression.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.ObjectExpression}
     *
     * @private
     */
    _parseObjectExpression() {
        this._expect(Lexer.T_CURLY_BRACKET_OPEN);
        const start = this._getCurrentPosition();
        this._next();

        const properties = [];
        while (! this._lexer.isToken(Lexer.T_CURLY_BRACKET_CLOSE)) {
            const start = this._getCurrentPosition();
            if ('...' === this._lexer.token.value) {
                this._next();
                const argument = this._parseExpression({ maxLevel: 2 });

                properties.push(new AST.SpreadElement(this._makeLocation(start), argument));
            } else {
                const { Generator, Static, Get, Set, Async, MethodName, property } = this._parseObjectMemberSignature();
                const kind = Get ? 'get' : Set ? 'set' : 'method';

                if (Static) {
                    this._syntaxError('Unexpected "static" keyword');
                }

                if (! property) {
                    properties.push(this._parseObjectMethod(start, MethodName, kind, {
                        async: Async,
                        generator: Generator,
                    }));
                } else {
                    let property;
                    if (this._lexer.isToken(Lexer.T_COLON)) {
                        this._next();
                        const expr = this._parseExpression({ maxLevel: 2 });
                        property = new AST.ObjectProperty(this._makeLocation(start), MethodName, expr);
                    } else {
                        property = new AST.ObjectProperty(this._makeLocation(start), MethodName, null);
                    }

                    properties.push(property);
                }
            }

            this._skipSpaces();

            if (! this._lexer.isToken(Lexer.T_COMMA)) {
                this._expect(Lexer.T_CURLY_BRACKET_CLOSE);
                break;
            } else {
                this._next();
            }
        }

        this._next(false);

        return new AST.ObjectExpression(this._makeLocation(start), properties);
    }

    /**
     * Parses an object method.
     *
     * @param {[Jymfony.Component.Autoloader.Parser.AST.Position, int]} start
     * @param {null|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} id
     * @param {string} kind
     * @param {{async: boolean, generator: boolean}} opts
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.ClassMethod}
     *
     * @private
     */
    _parseObjectMethod(start, id, kind, opts) {
        const args = this._parseFormalParametersList();
        const body = this._parseBlockStatement();

        return new AST.ObjectMethod(this._makeLocation(start), body, id, kind, args, opts);
    }

    _parseExpressionStage1(start, maxLevel) {
        if ([ Lexer.T_IDENTIFIER, Lexer.T_YIELD, Lexer.T_SET, Lexer.T_GET, Lexer.T_DECORATOR, Lexer.T_OPEN_PARENTHESIS, Lexer.T_ASYNC, Lexer.T_ARGUMENTS ].includes(this._lexer.token.type) && this._isArrowFunctionExpression()) {
            return this._parseArrowFunctionExpression();
        }

        let expression;

        // Literals and level 20
        switch (this._lexer.token.type) {
            case Lexer.T_SPREAD: {
                this._next();
                const expr = this._parseExpression();

                expression = new AST.SpreadElement(this._makeLocation(start), expr);
            } break;

            case Lexer.T_CLASS: {
                expression = new AST.ClassExpression(...this._parseClass());
            } break;

            case Lexer.T_ASYNC:
            case Lexer.T_FUNCTION: {
                const async = Lexer.T_ASYNC === this._lexer.token.type;
                if (async) {
                    this._next();
                }

                this._next(); // Function keyword. async arrow functions are already handled.

                const generator = '*' === this._lexer.token.value;
                if (generator) {
                    this._next();
                }

                let id = null;
                if (! this._lexer.isToken(Lexer.T_OPEN_PARENTHESIS)) {
                    id = new AST.Identifier(null, this._lexer.token.value);
                    this._next();
                }

                this._expect(Lexer.T_OPEN_PARENTHESIS);
                let args = [];
                if (! this._lexer.isToken(Lexer.T_CLOSED_PARENTHESIS)) {
                    args = this._parseFormalParametersList();
                }

                const body = this._parseBlockStatement();

                expression = new AST.FunctionExpression(this._makeLocation(start), body, id, args, { generator, async });
            } break;

            case Lexer.T_TRUE:
            case Lexer.T_FALSE: {
                const value = this._lexer.isToken(Lexer.T_TRUE);
                this._next(false);

                expression = new AST.BooleanLiteral(this._makeLocation(start), value);
            } break;

            case Lexer.T_REGEX: {
                const regex = this._lexer.token.value;
                this._next(false);

                expression = new AST.RegExpLiteral(this._makeLocation(start), regex);
            } break;

            case Lexer.T_NUMBER: {
                let number = this._lexer.token.value;
                this._next(false);

                if (number.startsWith('0x')) {
                    number = Number.parseInt(number.substr(2), 16);
                } else if (number.startsWith('0o')) {
                    number = Number.parseInt(number.substr(2), 8);
                } else if (number.startsWith('0b')) {
                    number = Number.parseInt(number.substr(2), 2);
                } else {
                    number = Number.parseFloat(number);
                }

                expression = new AST.NumberLiteral(this._makeLocation(start), number);
            } break;

            case Lexer.T_STRING: {
                const string = this._lexer.token.value;
                this._next(false);

                expression = new AST.StringLiteral(this._makeLocation(start), string);
            } break;

            case Lexer.T_NULL: {
                this._next(false);

                expression = new AST.NullLiteral(this._makeLocation(start));
            } break;

            case Lexer.T_CURLY_BRACKET_OPEN: {
                expression = this._parseObjectExpression();
            } break;

            case Lexer.T_OPEN_SQUARE_BRACKET: {
                this._next();

                let elements = [];
                if (! this._lexer.isToken(Lexer.T_CLOSED_SQUARE_BRACKET)) {
                    elements = this._parseExpression();
                }

                this._next(false);

                expression = new AST.ArrayExpression(this._makeLocation(start), elements instanceof AST.SequenceExpression ? elements.expressions.map(exp => undefined === exp ? null : exp) : elements);
            } break;

            case Lexer.T_OPEN_PARENTHESIS: {
                const docblock = this._pendingDocblock; // JSDoc casting
                this._pendingDocblock = undefined;

                this._next();
                const expr = this._parseExpression();
                this._expect(Lexer.T_CLOSED_PARENTHESIS);
                this._next(false);

                expression = new AST.ParenthesizedExpression(this._makeLocation(start), expr);
                expression.docblock = docblock || null;
            } break;
        }

        if (20 === maxLevel) {
            return undefined;
        }

        cycle: while (true) {
            const state = this.state;
            this._skipSpaces();

            // Level 19-18
            switch (this._lexer.token.type) {
                case Lexer.T_DOT: {
                    if (undefined === expression) {
                        debugger;
                    }

                    this._next();
                    const optional = false;
                    const property = this._parseIdentifier();

                    expression = new AST.MemberExpression(this._makeLocation(start), expression, property, false, optional);
                } break;

                case Lexer.T_OPEN_SQUARE_BRACKET: {
                    if (null === expression) {
                        debugger;
                    }

                    this._next();
                    const optional = false;
                    const property = this._parseExpression();
                    this._expect(Lexer.T_CLOSED_SQUARE_BRACKET);
                    this._next(false);

                    expression = new AST.MemberExpression(this._makeLocation(start), expression, property, true, optional);
                } break;

                case Lexer.T_THIS:
                case Lexer.T_SUPER:
                case Lexer.T_SET:
                case Lexer.T_GET:
                case Lexer.T_ASYNC:
                case Lexer.T_DECORATOR:
                case Lexer.T_ARGUMENTS:
                case Lexer.T_IDENTIFIER: {
                    if (undefined !== expression) {
                        this.state = state;
                        break cycle;
                    }

                    expression = this._parseIdentifier();
                } break;

                case Lexer.T_NEW: {
                    const identifier = this._parseIdentifier();
                    this._skipSpaces();

                    if (this._lexer.isToken(Lexer.T_DOT)) { // New.target
                        this._next();
                        const property = this._parseIdentifier();
                        expression = new AST.MemberExpression(this._makeLocation(start), identifier, property, false, false);
                    } else if (this._lexer.isToken(Lexer.T_OPEN_SQUARE_BRACKET)) {
                        this._next();
                        const property = this._parseExpression({ maxLevel: 2 });

                        expression = new AST.MemberExpression(this._makeLocation(start), identifier, property, false, false);

                        this._expect(Lexer.T_CLOSED_SQUARE_BRACKET);
                        this._next();
                    } else {
                        const callExpression = this._parseExpression({ maxLevel: 19 });
                        const [ callee, args ] = callExpression instanceof AST.CallExpression ? [ callExpression.callee, callExpression.args ] : [ callExpression, [] ];
                        expression = new AST.NewExpression(this._makeLocation(start), callee, args);
                    }
                } break;

                case Lexer.T_OPEN_PARENTHESIS: {
                    // Function call
                    this._next();

                    const args = this._lexer.isToken(Lexer.T_CLOSED_PARENTHESIS) ? [] : this._parseExpression();
                    this._expect(Lexer.T_CLOSED_PARENTHESIS);
                    this._next(false);

                    expression = new AST.CallExpression(
                        this._makeLocation(start),
                        expression,
                        args instanceof AST.SequenceExpression ? args.expressions : (isArray(args) ? args : [ args ])
                    );

                    if (18 < maxLevel) {
                        return expression;
                    }
                } break;

                default: {
                    this.state = state;
                    break cycle;
                }
            }
        }

        const state = this.state;
        this._skipSpaces();

        if (this._lexer.isToken(Lexer.T_STRING) && this._lexer.token.value.startsWith('`')) {
            const template = this._parseExpression({ maxLevel: 19 });
            expression = new AST.TaggedTemplateExpression(this._makeLocation(start), expression, template);
        } else {
            this.state = state;
        }

        return expression;
    }

    /**
     * Parses an expression.
     *
     * @param {int} maxLevel
     * @param {boolean} pattern
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     *
     * @private
     */
    _parseExpression({ maxLevel = -1, pattern = false } = {}) {
        const start = this._getCurrentPosition();
        let expression;

        const state = this.state;
        try {
            expression = this._parseExpressionStage1(start, maxLevel);
        } catch (e) {
            if (pattern) {
                throw e;
            }

            this.state = state;
            try {
                expression = this._parsePattern();
            } catch (_) {
                throw e;
            }
        }
        if (17 < maxLevel) {
            return expression;
        }

        if (undefined !== expression) {
            // Level 17
            if (this._lexer.isToken(Lexer.T_OPERATOR) && [ '++', '--' ].includes(this._lexer.token.value)) {
                const operator = this._lexer.token.value;
                this._next();

                expression = new AST.UpdateExpression(this._makeLocation(start), operator, expression, false);
            }
        } else {
            // Level 16
            switch (this._lexer.token.value) {
                case '!':
                case '!!':
                case '~':
                case '~~':
                case '+':
                case '-':
                case 'typeof':
                case 'void':
                case 'delete': {
                    const operator = this._lexer.token.value;
                    this._next();

                    const argument = this._parseExpression({ maxLevel: 16 });
                    expression = new AST.UnaryExpression(this._makeLocation(start), operator, argument);
                } break;

                case '++':
                case '--': {
                    const operator = this._lexer.token.value;
                    this._next();

                    const argument = this._parseExpression({ maxLevel: 16 });
                    expression = new AST.UpdateExpression(this._makeLocation(start), operator, argument, true);
                } break;

                case 'await': {
                    this._next();
                    const promise = this._parseExpression({ maxLevel: 16 });

                    expression = new AST.AwaitExpression(this._makeLocation(start), promise);
                } break;
            }
        }

        const _binaryExpression = (level) => {
            if (maxLevel > level) {
                return;
            }

            const operator = this._lexer.token.value;
            this._next();

            const right = this._parseExpression({ maxLevel: level });
            expression = new AST.BinaryExpression(this._makeLocation(start), operator, expression, right);
        };

        this._skipSpaces();

        // Level 15
        if ('**' === this._lexer.token.value) {
            _binaryExpression(15);
        }

        if (this._lexer.isToken(Lexer.T_REGEX)) {
            throw new NotARegExpException(this._lexer.token);
        }

        // Level 14
        if ([ '*', '/', '%' ].includes(this._lexer.token.value)) {
            _binaryExpression(14);
        }

        // Level 13
        if ([ '+', '-' ].includes(this._lexer.token.value)) {
            _binaryExpression(13);
        }

        // Level 12
        if ([ '<<', '>>', '>>>' ].includes(this._lexer.token.value)) {
            _binaryExpression(12);
        }

        // Level 11
        if ([ '<', '<=', '>', '>=', 'in', 'instanceof' ].includes(this._lexer.token.value)) {
            _binaryExpression(11);
        }

        // Level 10
        if ([ '==', '!=', '===', '!==' ].includes(this._lexer.token.value)) {
            _binaryExpression(10);
        }

        // Level 9
        if ('&' === this._lexer.token.value) {
            _binaryExpression(9);
        }

        // Level 8
        if ('^' === this._lexer.token.value) {
            _binaryExpression(8);
        }

        // Level 7
        if ('|' === this._lexer.token.value) {
            _binaryExpression(7);
        }

        // Level 6
        if ('&&' === this._lexer.token.value) {
            _binaryExpression(6);
        }

        // Level 5
        if ('||' === this._lexer.token.value) {
            _binaryExpression(5);
        }

        if (4 < maxLevel) {
            return expression;
        }

        // Level 4
        if (this._lexer.isToken(Lexer.T_QUESTION_MARK)) {
            this._next();

            const consequent = this._parseExpression({ maxLevel: 2 });
            this._expect(Lexer.T_COLON);
            this._next();
            const alternate = this._parseExpression({ maxLevel: 2 });

            expression = new AST.ConditionalExpression(this._makeLocation(start), expression, consequent, alternate);
        }

        if (3 < maxLevel) {
            return expression;
        }

        // Level 3
        if (this._lexer.isToken(Lexer.T_ASSIGNMENT_OP)) {
            const operator = this._lexer.token.value;

            this._next();
            const right = this._parseExpression({ maxLevel: 3 });
            expression = new AST.AssignmentExpression(this._makeLocation(start), operator, expression, right);
        }

        if (2 < maxLevel) {
            return expression;
        }

        // Level 2
        if (Lexer.T_YIELD === this._lexer.token.type) {
            this._next();
            const delegate = '*' === this._lexer.token.value;
            if (delegate) {
                this._next();
            }

            const state = this.state;
            let argument = null;
            try {
                argument = this._parseExpression({ maxLevel: 2 }) || null;
            } catch (e) {
                this.state = state;
            }

            expression = new AST.YieldExpression(this._makeLocation(start), argument, delegate);
        }

        if (1 < maxLevel) {
            return expression;
        }

        if (this._lexer.isToken(Lexer.T_COMMA)) {
            this._next();

            const args = [ expression ];
            if (! [ Lexer.T_CLOSED_SQUARE_BRACKET, Lexer.T_CURLY_BRACKET_CLOSE, Lexer.T_CLOSED_PARENTHESIS ].includes(this._lexer.token.type)) {
                const right = this._parseExpression();
                args.push(...(right instanceof AST.SequenceExpression ? right.expressions : [ right ]));
            }

            expression = new AST.SequenceExpression(this._makeLocation(start), args);
        }

        return expression;
    }
}

module.exports = getTrait(ExpressionParserTrait);
