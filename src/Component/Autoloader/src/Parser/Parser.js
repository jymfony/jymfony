const AST = require('./AST');
const Lexer = require('./Lexer');

const RescanException = require('./Exception/RescanException');
const WrongAssignmentException = require('./Exception/WrongAssignmentException');
const ExpressionParserTrait = require('./ExpressionParserTrait');

const FOR_PLAIN = 1;
const FOR_IN = 2;
const FOR_OF = 3;

/**
 * @memberOf Jymfony.Component.Autoloader.Parser
 */
class Parser extends implementationOf(ExpressionParserTrait) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.DescriptorStorage} descriptorStorage
     */
    __construct(descriptorStorage) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.Lexer}
         *
         * @private
         */
        this._lexer = new Lexer();

        /**
         * Gets the original source.
         *
         * @type {string}
         *
         * @private
         */
        this._input = undefined;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.Token}
         *
         * @private
         */
        this._lastToken = undefined;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.Token}
         *
         * @private
         */
        this._lastNonBlankToken = undefined;

        /**
         * @type {int}
         *
         * @private
         */
        this._line = 1;

        /**
         * @type {int}
         *
         * @private
         */
        this._column = 0;

        /**
         * @type {int}
         *
         * @private
         */
        this._level = 0;

        /**
         * @type {string}
         *
         * @private
         */
        this._pendingDocblock = undefined;

        /**
         * @type {*[]}
         *
         * @private
         */
        this._pendingDecorators = [];

        /**
         * @type {Jymfony.Component.Autoloader.DescriptorStorage}
         *
         * @private
         */
        this._descriptorStorage = descriptorStorage;

        /**
         * @type {Object.<string, function (*): Jymfony.Component.Autoloader.Parser.AST.AppliedDecorator>}
         *
         * @private
         */
        this._decorators = {
            '@initialize': (location, callback) => {
                return new AST.InitializeDecorator(location, callback);
            },
            '@register': (location, callback) => {
                return new AST.RegisterDecorator(location, callback);
            },
        };

        /**
         * @type {boolean}
         *
         * @private
         */
        this._esModule = false;
    }

    /**
     * Gets the current parser state.
     *
     * @returns {{line: int, column: int, position: int, docblock: string, decorators: *[], level: int, esModule: boolean}}
     */
    get state() {
        return {
            position: this._lexer.position,
            line: this._line,
            column: this._column,
            docblock: this._pendingDocblock,
            decorators: [ ...this._pendingDecorators ],
            level: this._level,
            esModule: this._esModule,
        };
    }

    /**
     * Sets the parser state.
     *
     * @param {int} position
     * @param {int} line
     * @param {int} column
     * @param {string} docblock
     * @param {*[]} decorators
     * @param {int} level
     * @param {boolean} esModule
     */
    set state({ position, line, column, docblock, decorators, level, esModule }) {
        this._lexer.resetPosition(position - 1);
        this._line = line;
        this._column = column;
        this._pendingDocblock = docblock;
        this._pendingDecorators = decorators;
        this._level = level;
        this._esModule = esModule;
    }

    /**
     * Parses a js script.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.Program}
     */
    parse(code) {
        const lines = code.split(/\r\n|\r|\n/);
        this._lexer.input = this._input = code;

        while (true) {
            this._line = 1;
            this._column = 0;
            this._pendingDecorators = [];
            this._level = 0;
            this._esModule = false;
            this._lastToken = undefined;
            this._lastNonBlankToken = undefined;

            this._next();
            this._skipSpaces();

            const program = new AST.Program(new AST.SourceLocation(
                this._lexer.input,
                new AST.Position(1, 0),
                new AST.Position(lines.length, lines[lines.length - 1].length - 1)
            ));

            try {
                while (this._lexer.token && !this._lexer.isToken(Lexer.T_EOF)) {
                    program.add(this._doParse());
                    this._skipSpaces();
                }
            } catch (e) {
                if (e instanceof RescanException) {
                    this._lexer.rescan(e.token, e);
                    this._lexer.reset();
                    continue;
                }

                throw e;
            }

            program.esModule = this._esModule;

            return program;
        }
    }

    /**
     * Parse a token.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.NodeInterface}
     *
     * @private
     */
    _doParse() {
        return this._parseStatement();
    }

    /**
     * Advances the internal position counters.
     *
     * @param {string} value
     *
     * @private
     */
    _advance(value = this._lexer.token.value) {
        for (const char of value.split('')) {
            if ('\n' === char) {
                this._line++;
                this._column = 0;
            } else {
                this._column++;
            }
        }
    }

    /**
     * Gets the current position.
     *
     * @returns {[Jymfony.Component.Autoloader.Parser.AST.Position, int]}
     *
     * @private
     */
    _getCurrentPosition() {
        return [ new AST.Position(this._line, this._column), this._lexer.token.position ];
    }

    /**
     * Makes a location.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.Position} startPosition
     * @param {int} inputStart
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
     *
     * @private
     */
    _makeLocation([ startPosition, inputStart ]) {
        return new AST.SourceLocation(
            this._input.substr(inputStart, this._lexer.token.position - inputStart),
            startPosition,
            new AST.Position(this._line, this._column)
        );
    }

    static _includesLineTerminator(value) {
        return value.includes('\n') ||
            value.includes('\r') ||
            value.includes('\u2028') ||
            value.includes('\u2029');
    }

    /**
     * Assert there's a statement termination (newline or semicolon).
     *
     * @private
     */
    _expectStatementTermination() {
        const lastToken = this._lastToken;
        const lastNonBlankToken = this._lastNonBlankToken;
        if (this._lexer.isToken(Lexer.T_SPACE) && ! Parser._includesLineTerminator(this._lexer.token.value)) {
            this._skipSpaces();
        }

        // Needs semicolon or newline
        if (this._lexer.isToken(Lexer.T_SEMICOLON)) {
            this._skipSemicolon();
            this._skipSpaces();
        } else if ((this._lexer.isToken(Lexer.T_SPACE) && Parser._includesLineTerminator(this._lexer.token.value)) || (lastToken && Lexer.T_SPACE === lastToken.type && Parser._includesLineTerminator(lastToken.value))) {
            this._skipSpaces();
        } else if (lastNonBlankToken && (Lexer.T_CURLY_BRACKET_CLOSE === lastNonBlankToken.type || this._lexer.isToken(Lexer.T_CURLY_BRACKET_CLOSE))) {
            this._skipSpaces();
        } else if (this._lexer.isToken(Lexer.T_EOF) || (lastToken && lastToken.type === Lexer.T_EOF) || (lastNonBlankToken && lastNonBlankToken.type === Lexer.T_SEMICOLON)) {
            // Do nothing
        } else {
            this._syntaxError('Unexpected "' + this._lexer.token.value + '": statement termination expected.');
        }
    }

    _syntaxError(message = 'Syntax error') {
        throw new SyntaxError(message + ' near line ' + this._line + ' column ' + (this._column + 1));
    }

    _expect(type) {
        if (! this._lexer.isToken(type)) {
            this._syntaxError('Unexpected "' + this._lexer.token.value + '"');
        }
    }

    /**
     * Skip spaces and advances the internal position.
     *
     * @private
     */
    _skipSpaces(processDecorators = false) {
        if (! this._lexer.isToken(Lexer.T_SPACE)) {
            return;
        }

        while (this._lexer.isToken(Lexer.T_SPACE)) {
            this._next(false, processDecorators);
        }
    }

    _next(skipSpaces = true, processDecorators = false) {
        this._lastToken = this._lexer.token;
        while (true) {
            if (this._lexer.token) {
                this._advance();
            }

            if (! this._lexer.isToken(Lexer.T_SPACE)) {
                this._lastNonBlankToken = this._lexer.token;
            }

            this._lexer.moveNext();

            if (skipSpaces) {
                this._skipSpaces(processDecorators);
            }

            if (this._lexer.isToken(Lexer.T_DOCBLOCK)) {
                this._pendingDocblock = this._lexer.token.value;
                continue;
            }

            if (! processDecorators && this._lexer.isToken(Lexer.T_DECORATOR_IDENTIFIER)) {
                const docblock = this._pendingDocblock;
                this._pendingDocblock = undefined;

                const decorators = this._pendingDecorators;
                decorators.push(this._parseDecorator());
                this._pendingDecorators = decorators;

                this._pendingDocblock = docblock;
                this._skipSpaces();
            }

            if (this._lexer.isToken(Lexer.T_COMMENT)) {
                continue;
            }

            break;
        }
    }

    /**
     * Skips eventual semicolon.
     *
     * @private
     */
    _skipSemicolon() {
        if (this._lexer.isToken(Lexer.T_SEMICOLON)) {
            this._next(false);
        }
    }

    _isPlainFor() {
        const input = this._input.substr(this._lexer.token.position);
        let level = 0, position = 0;

        while (true) {
            const chr = input[position++];
            if (undefined === chr) {
                return false;
            }

            if ('(' === chr) {
                ++level;
            } else if (')' === chr) {
                if (0 === level) {
                    return false;
                }

                --level;
            }

            if (0 === level && ';' === chr) {
                return true;
            }
        }
    }

    _parseDecorator() {
        const start = this._getCurrentPosition();
        this._expect(Lexer.T_DECORATOR_IDENTIFIER);

        const name = this._parseIdentifier();
        this._skipSpaces();

        let args = [];
        if (this._lexer.isToken(Lexer.T_OPEN_PARENTHESIS)) {
            this._next();
            const expr = ! this._lexer.isToken(Lexer.T_CLOSED_PARENTHESIS) ? this._parseExpression() : undefined;
            this._expect(Lexer.T_CLOSED_PARENTHESIS);
            this._next(false);

            args = undefined === expr ? [] : (expr instanceof AST.SequenceExpression ? expr.expressions : [ expr ]);
        }

        if (undefined === this._decorators[name.name]) {
            this._syntaxError('Unknown applied "' + name.name + '" decorator.');
        }

        const location = this._makeLocation(start);
        return this._decorators[name.name](location, ...args);
    }

    /**
     * Initiate a keyword parsing.
     *
     * @private
     */
    _parseKeyword() {
        const start = this._getCurrentPosition();
        const token = this._lexer.token;

        switch (token.value) {
            case 'var':
            case 'let':
            case 'const': {
                const kind = token.value;
                this._next();

                const declarators = [];

                while (true) {
                    const start = this._getCurrentPosition();
                    const pattern = this._parsePattern();
                    const init = pattern instanceof AST.AssignmentPattern ? pattern.right : null;

                    declarators.push(new AST.VariableDeclarator(
                        this._makeLocation(start),
                        pattern instanceof AST.AssignmentPattern ? pattern.left : pattern,
                        init
                    ));

                    this._skipSpaces();
                    if (! this._lexer.isToken(Lexer.T_COMMA)) {
                        break;
                    } else {
                        this._next();
                    }
                }

                return new AST.VariableDeclaration(this._makeLocation(start), kind, declarators);
            }

            case 'try': {
                this._next();

                const block = this._parseBlockStatement();
                let handler = null, finalizer = null;

                let state = this.state;
                this._skipSpaces();

                if ('catch' === this._lexer.token.value) {
                    const start = this._getCurrentPosition();
                    this._next();

                    let param = null;
                    if (this._lexer.isToken(Lexer.T_OPEN_PARENTHESIS)) {
                        this._next();
                        param = this._parsePattern();
                        this._expect(Lexer.T_CLOSED_PARENTHESIS);
                        this._next();
                    }

                    const catchBody = this._parseBlockStatement();
                    handler = new AST.CatchClause(this._makeLocation(start), param, catchBody);

                    state = this.state;
                    this._skipSpaces();
                }

                if ('finally' === this._lexer.token.value) {
                    this._next();
                    finalizer = this._parseBlockStatement();

                    state = this.state;
                }

                this.state = state;

                return new AST.TryStatement(this._makeLocation(start), block, handler, finalizer);
            }

            case 'decorator': {
                const state = this.state;
                this._next(true, true);
                const name = this._parseIdentifier();

                if (! name.isDecoratorIdentifier) {
                    // Not a decorator declaration statement.
                    this.state = state;
                    const expression = this._parseExpression();

                    return new AST.ExpressionStatement(this._makeLocation(start), expression);
                }

                const args = this._lexer.isToken(Lexer.T_OPEN_PARENTHESIS) ? this._parseFormalParametersList() : [];
                this._expect(Lexer.T_CURLY_BRACKET_OPEN);
                this._next(true, true);

                const innerDecorators = [];
                while (true) {
                    this._skipSpaces(true);
                    if (this._lexer.isToken(Lexer.T_CURLY_BRACKET_CLOSE)) {
                        break;
                    }

                    innerDecorators.push(this._parseDecorator());
                }

                this._next(true, true);
                const descriptor = new AST.DecoratorDescriptor(this._makeLocation(start), name, args, innerDecorators);
                this._decorators[name.name] = (location, ...args) => {
                    return new AST.AppliedDecorator(location, descriptor, args);
                };

                return descriptor;
            }

            case 'for': {
                let type = FOR_PLAIN, _await = false, init = null;

                this._next();
                if (Lexer.T_AWAIT === this._lexer.token.type) {
                    _await = true;
                }

                this._expect(Lexer.T_OPEN_PARENTHESIS);
                this._next();

                if (! this._lexer.isToken(Lexer.T_SEMICOLON)) {
                    init = [ 'let', 'const', 'var' ].includes(this._lexer.token.value) ?
                        this._parseKeyword() :
                        this._isPlainFor() ? this._parseExpression() : this._parsePattern();
                }

                if (_await && 'of' !== this._lexer.token.value) {
                    this._syntaxError('Unexpected "' + this._lexer.token.value + '"');
                }

                if (this._lexer.isToken(Lexer.T_SEMICOLON)) {
                    let test = null, update = null;
                    this._next();

                    // Test
                    if (! this._lexer.isToken(Lexer.T_SEMICOLON)) {
                        test = this._parseExpression();
                    }

                    this._expect(Lexer.T_SEMICOLON);
                    this._next();

                    // Update
                    if (! this._lexer.isToken(Lexer.T_CLOSED_PARENTHESIS)) {
                        update = this._parseExpression();
                    }

                    this._expect(Lexer.T_CLOSED_PARENTHESIS);
                    this._next();

                    const body = this._parseStatement();

                    return new AST.ForStatement(this._makeLocation(start), init, test, update, body);
                } else if ('of' === this._lexer.token.value) {
                    type = FOR_OF;
                } else if ('in' === this._lexer.token.value) {
                    type = FOR_IN;
                }

                this._next();
                const right = this._parseExpression();

                this._expect(Lexer.T_CLOSED_PARENTHESIS);
                this._next();
                const body = this._parseStatement();

                if (FOR_IN === type) {
                    return new AST.ForInStatement(this._makeLocation(start), init, right, body);
                }

                return new AST.ForOfStatement(this._makeLocation(start), init, right, body, _await);
            }

            case 'continue': {
                this._next(false);
                if (this._lexer.isToken(Lexer.T_SPACE) && ! Parser._includesLineTerminator(this._lexer.token.value)) {
                    this._skipSpaces();
                }

                let label = null;
                if (this._lexer.isToken(Lexer.T_IDENTIFIER)) {
                    label = this._parseIdentifier();
                }

                return new AST.ContinueStatement(this._makeLocation(start), label);
            }

            case 'break': {
                this._next();

                let label = null;
                if (this._lexer.isToken(Lexer.T_IDENTIFIER)) {
                    label = this._parseIdentifier();
                }

                return new AST.BreakStatement(this._makeLocation(start), label);
            }

            case 'while': {
                this._next();

                this._expect(Lexer.T_OPEN_PARENTHESIS);
                this._next();

                const test = this._parseExpression();

                this._expect(Lexer.T_CLOSED_PARENTHESIS);
                this._next();

                const body = this._parseStatement();

                return new AST.WhileStatement(this._makeLocation(start), test, body);
            }

            case 'do': {
                this._next();

                const body = this._parseStatement();

                if (this._lexer.isToken(Lexer.T_SEMICOLON)) {
                    this._expectStatementTermination();
                }

                this._skipSpaces();
                if ('while' !== this._lexer.token.value) {
                    this._syntaxError('Unexpected "' + this._lexer.token.value + '"');
                }

                this._next();
                this._expect(Lexer.T_OPEN_PARENTHESIS);
                this._next();

                const test = this._parseExpression();

                this._expect(Lexer.T_CLOSED_PARENTHESIS);
                this._next();

                return new AST.DoWhileStatement(this._makeLocation(start), test, body);
            }

            case 'switch': {
                this._next();

                this._expect(Lexer.T_OPEN_PARENTHESIS);
                this._next();

                const discriminant = this._parseExpression();

                this._expect(Lexer.T_CLOSED_PARENTHESIS);
                this._next();

                this._expect(Lexer.T_CURLY_BRACKET_OPEN);
                this._next();

                const cases = [];
                while (! this._lexer.isToken(Lexer.T_CURLY_BRACKET_CLOSE)) {
                    const start = this._getCurrentPosition();
                    const token = this._lexer.token;
                    this._next();

                    let test = null;
                    if ('case' === token.value) {
                        test = this._parseExpression();
                    }

                    this._expect(Lexer.T_COLON);

                    this._next();
                    const consequent = [];

                    while ('case' !== this._lexer.token.value && 'default' !== this._lexer.token.value && ! this._lexer.isToken(Lexer.T_CURLY_BRACKET_CLOSE)) {
                        consequent.push(this._parseStatement());
                        this._skipSpaces();
                    }

                    cases.push(new AST.SwitchCase(this._makeLocation(start), test, consequent));
                }

                this._next(false);

                return new AST.SwitchStatement(this._makeLocation(start), discriminant, cases);
            }

            case 'debugger': {
                this._next(false);

                return new AST.DebuggerStatement(this._makeLocation(start));
            }

            case 'import': {
                const state = this.state;
                this._esModule = true;
                this._next();

                if (this._lexer.isToken(Lexer.T_STRING)) {
                    const source = this._parseExpression();

                    return new AST.ImportDeclaration(this._makeLocation(start), [], source);
                } else if (this._lexer.isToken(Lexer.T_OPEN_PARENTHESIS)) {
                    this.state = state;
                    const expression = this._parseExpression();

                    return new AST.ExpressionStatement(this._makeLocation(start), expression);
                }

                const specifiers = [];
                while (true) {
                    const start = this._getCurrentPosition();
                    if ('from' === this._lexer.token.value) {
                        break;
                    } else if ('*' === this._lexer.token.value) {
                        const start = this._getCurrentPosition();
                        this._next();
                        if ('as' !== this._lexer.token.value) {
                            this._syntaxError('"as" expected');
                        }

                        this._next();
                        const local = this._parseIdentifier();

                        specifiers.push(new AST.ImportNamespaceSpecifier(this._makeLocation(start), local));
                        this._next();
                    } else {
                        if (this._lexer.isToken(Lexer.T_CURLY_BRACKET_OPEN)) {
                            this._next(true, true);

                            while (true) {
                                const start = this._getCurrentPosition();
                                let imported = null, local = null;

                                if (this._lexer.isToken(Lexer.T_CURLY_BRACKET_CLOSE)) {
                                    this._next();
                                    break;
                                }

                                if (this._lexer.isToken(Lexer.T_DECORATOR_IDENTIFIER) || this._lexer.isToken(Lexer.T_IDENTIFIER) || this._lexer.isToken(Lexer.T_KEYWORD) || this._lexer.isToken(Lexer.T_NULL)) {
                                    const decorator = this._lexer.isToken(Lexer.T_DECORATOR_IDENTIFIER);
                                    imported = local = this._parseIdentifier();
                                    this._skipSpaces();

                                    if ('as' === this._lexer.token.value) {
                                        this._next();
                                        local = this._parseIdentifier();
                                        this._skipSpaces();
                                    }

                                    if (decorator && ! local.isDecoratorIdentifier) {
                                        this._syntaxError('"' + local.name + '" is not a valid decorator alias');
                                    }

                                    specifiers.push(new AST.ImportSpecifier(this._makeLocation(start), local, imported));
                                }

                                if (! this._lexer.isToken(Lexer.T_COMMA)) {
                                    this._expect(Lexer.T_CURLY_BRACKET_CLOSE);
                                } else {
                                    this._next(true, true);
                                }
                            }
                        } else {
                            const local = this._parseIdentifier();
                            this._skipSpaces();

                            specifiers.push(new AST.ImportDefaultSpecifier(this._makeLocation(start), local));
                        }

                        if (this._lexer.isToken(Lexer.T_COMMA)) {
                            this._next();
                        }
                    }
                }

                if ('from' !== this._lexer.token.value) {
                    this._syntaxError('"from" expected');
                }

                this._next();
                this._expect(Lexer.T_STRING);

                const source = this._parseExpression();
                if (! (source instanceof AST.StringLiteral)) {
                    this._syntaxError('import source expected');
                }

                for (const specifier of specifiers) {
                    if (specifier instanceof AST.ImportSpecifier && specifier.local.isDecoratorIdentifier) {
                        const local = specifier.local;
                        const imported = specifier.imported;
                        const sourceFn = eval(source.value);

                        this._decorators[local.name] = (location, ...args) => {
                            return new AST.AppliedDecorator(location, this._descriptorStorage.import(sourceFn, imported.name), args);
                        };
                    }
                }

                return new AST.ImportDeclaration(this._makeLocation(start), specifiers, source);
            }

            case 'export': {
                this._esModule = true;
                this._next();

                if ('default' === this._lexer.token.value) {
                    this._next();
                    const expression = this._parseExpression();

                    return new AST.ExportDefaultDeclaration(this._makeLocation(start), expression);
                } else if ([ 'decorator', 'const', 'let', 'var' ].includes(this._lexer.token.value)) {
                    const declarations = this._parseKeyword();
                    const declaration = new AST.ExportNamedDeclaration(this._makeLocation(start), declarations, [], null);

                    if (declarations instanceof AST.DecoratorDescriptor) {
                        this._descriptorStorage.register(declarations);
                    }

                    return declaration;
                } else if ([ 'function', 'class' ].includes(this._lexer.token.value)) {
                    const declaration = this._parseStatement(true);

                    return new AST.ExportNamedDeclaration(this._makeLocation(start), declaration, [], null);
                } else if (this._lexer.isToken(Lexer.T_CURLY_BRACKET_OPEN)) {
                    this._next();

                    let source = null;
                    const specifiers = [];
                    while (! this._lexer.isToken(Lexer.T_CURLY_BRACKET_CLOSE)) {
                        const start = this._getCurrentPosition();

                        let exported;
                        const local = exported = this._parseIdentifier();
                        this._skipSpaces();

                        if ('as' === this._lexer.token.value) {
                            this._next();
                            exported = this._parseIdentifier();
                            this._skipSpaces();
                        }

                        specifiers.push(new AST.ExportSpecifier(this._makeLocation(start), local, exported));
                    }

                    this._next(); // Curly brace closed.
                    if ('from' === this._lexer.token.value) {
                        this._next();
                        this._expect(Lexer.T_STRING);

                        source = this._parseExpression();
                    }

                    for (const specifier of specifiers) {
                        if (specifier.local.isDecoratorIdentifier) {
                            this._descriptorStorage.register(this._decorators(null).decorator, specifier.exported);
                        }
                    }

                    return new AST.ExportNamedDeclaration(this._makeLocation(start), null, specifiers, source);
                } else if ('*' === this._lexer.token.value) {
                    this._next();
                    if ('from' !== this._lexer.token.value) {
                        this._syntaxError('Expected "from"');
                    }

                    this._next();
                    this._expect(Lexer.T_STRING);
                    const source = this._parseExpression();
                    this._descriptorStorage.registerAllFrom(eval(source.value));

                    return new AST.ExportAllDeclaration(this._makeLocation(start), source);
                }
            }

            default:
                this._syntaxError('Unexpected "' + token.value + '"');
        }
    }

    /**
     * Parse a pattern node.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.Identifier|*}
     *
     * @private
     */
    _parsePattern() {
        const start = this._getCurrentPosition();
        let pattern;

        switch (this._lexer.token.type) {
            case Lexer.T_SPREAD: {
                this._next();
                const rest = this._parsePattern();

                pattern = new AST.SpreadElement(this._makeLocation(start), rest);
            } break;

            case Lexer.T_CURLY_BRACKET_OPEN: {
                this._next();

                const properties = [];
                while (! this._lexer.isToken(Lexer.T_CURLY_BRACKET_CLOSE)) {
                    const start = this._getCurrentPosition();
                    let key, value = null;

                    if (this._lexer.isToken(Lexer.T_OPEN_SQUARE_BRACKET)) {
                        this._next();
                        key = this._parseExpression({ maxLevel: 2 });
                        this._expect(Lexer.T_CLOSED_SQUARE_BRACKET);
                        this._next();
                    } else if (this._lexer.isToken(Lexer.T_SPREAD)) {
                        this._next();
                        key = this._parseIdentifier();
                        key = new AST.SpreadElement(this._makeLocation(start), key);
                    } else {
                        key = this._parseIdentifier();
                    }

                    this._skipSpaces();

                    if (! (key instanceof AST.SpreadElement)) {
                        if (this._lexer.isToken(Lexer.T_COLON)) {
                            this._next();
                            value = this._parsePattern();
                        }

                        const init = this._maybeInitializer();
                        if (init) {
                            value = new AST.AssignmentPattern(this._makeLocation(start), value || key, init);
                        }
                    }

                    properties.push(new AST.AssignmentProperty(this._makeLocation(start), key, value));

                    if (this._lexer.isToken(Lexer.T_COMMA)) {
                        this._next();
                    }
                }

                this._next(true);

                pattern = new AST.ObjectPattern(this._makeLocation(start), properties);
            } break;

            case Lexer.T_OPEN_SQUARE_BRACKET: {
                this._next();

                let pendingElement = null;
                const elements = [];
                while (true) {
                    if (this._lexer.isToken(Lexer.T_COMMA)) {
                        elements.push(pendingElement);
                        pendingElement = null;
                        this._next();
                    }

                    if (this._lexer.isToken(Lexer.T_CLOSED_SQUARE_BRACKET)) {
                        if (null !== pendingElement) {
                            elements.push(pendingElement);
                        }
                        break;
                    }

                    if (! this._lexer.isToken(Lexer.T_COMMA) && ! this._lexer.isToken(Lexer.T_CLOSED_SQUARE_BRACKET)) {
                        pendingElement = this._parsePattern();
                    }
                }

                this._next(false);

                pattern = new AST.ArrayPattern(this._makeLocation(start), elements);
            } break;

            case Lexer.T_YIELD: {
                pattern = this._parseIdentifier();
            } break;

            case Lexer.T_OPEN_PARENTHESIS:
            case Lexer.T_NEW:
            case Lexer.T_THIS:
            case Lexer.T_SUPER:
            case Lexer.T_SET:
            case Lexer.T_GET:
            case Lexer.T_ASYNC:
            case Lexer.T_DECORATOR:
            case Lexer.T_ARGUMENTS:
            case Lexer.T_IDENTIFIER: {
                pattern = this._parseExpression({ maxLevel: 18, pattern: true });
            } break;

            default:
                this._syntaxError('Unexpected "' + this._lexer.token.value + '"');
        }

        this._skipSpaces();
        const assignment = this._maybeInitializer();

        if (null !== assignment) {
            return new AST.AssignmentPattern(this._makeLocation(start), pattern, assignment);
        }

        return pattern;
    }

    /**
     * Returns an initializer if any.
     *
     * @returns {null|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     *
     * @private
     */
    _maybeInitializer() {
        if ('=' === this._lexer.token.value[0] && '=' !== this._lexer.token.value) {
            throw new WrongAssignmentException(this._lexer.token);
        }

        if (! this._lexer.isToken(Lexer.T_ASSIGNMENT_OP) || '=' !== this._lexer.token.value) {
            return null;
        }

        this._next();

        return this._parseExpression({ maxLevel: 2 }) || null;
    }

    /**
     * Parse and returns an identifier, if any.
     *
     * @returns {null|Jymfony.Component.Autoloader.Parser.AST.Identifier}
     *
     * @private
     */
    _maybeIdentifier() {
        if (! this._lexer.isToken(Lexer.T_IDENTIFIER)) {
            return null;
        }

        return this._parseIdentifier();
    }

    /**
     * Parse an identifier.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.Identifier}
     *
     * @private
     */
    _parseIdentifier() {
        const start = this._getCurrentPosition();
        const identifier = this._lexer.token.value;
        this._next(false);

        return new AST.Identifier(this._makeLocation(start), identifier);
    }

    /**
     * Parses a class declaration.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.ClassDeclaration}
     *
     * @private
     */
    _parseClassDeclaration() {
        const declaration = new AST.ClassDeclaration(...this._parseClass());
        if (null === declaration.id) {
            this._syntaxError('Expected class name');
        }

        return declaration;
    }

    /**
     * Parses a class.
     *
     * @private
     */
    _parseClass() {
        const start = this._getCurrentPosition();

        this._next();
        const id = this._maybeIdentifier();
        this._skipSpaces();

        let superClass = null;
        if (this._lexer.isToken(Lexer.T_EXTENDS)) {
            this._next();
            superClass = this._parseExpression();
        }

        const body = this._parseClassBody();
        return [ this._makeLocation(start), body, id, superClass ];
    }

    _parseObjectMemberSignature() {
        let Generator = false, Static = false, Get = false, Set = false, Async = false, property = false, MethodName, state = this.state;
        const apply = (name, computed) => {
            switch (MethodName) {
                case 'static': Static = true; break;
                case 'get': Get = true; break;
                case 'set': Set = true; break;
                case 'async': Async = true; break;
            }

            MethodName = name;

            if (computed) {
                this._expect(Lexer.T_CLOSED_SQUARE_BRACKET);
            }

            this._next(false);
            state = this.state;
            this._skipSpaces();
        };

        if (this._lexer.isToken(Lexer.T_STATIC)) {
            apply('static');
        }

        if (this._lexer.isToken(Lexer.T_ASYNC)) {
            apply('async');
        }

        if ('*' === this._lexer.token.value) {
            Generator = true;
            this._next();
        }

        if (this._lexer.isToken(Lexer.T_GET) || this._lexer.isToken(Lexer.T_SET)) {
            apply(this._lexer.token.value);
        }

        if (this._lexer.isToken(Lexer.T_OPEN_SQUARE_BRACKET)) {
            this._next();
            apply(this._parseExpression({ maxLevel: 2 }), true);
        } else if (! [ Lexer.T_COLON, Lexer.T_OPEN_PARENTHESIS ].includes(this._lexer.token.type)) {
            apply(this._lexer.token.value);
        }

        if ([ Lexer.T_COLON, Lexer.T_SEMICOLON, Lexer.T_ASSIGNMENT_OP ].includes(this._lexer.token.type)) {
            property = true;
            if (Generator || Get || Set || Async) {
                this._syntaxError('Unexpected "' + this._lexer.token.value + '"');
            }
        } else if ([ Lexer.T_COMMA, Lexer.T_CURLY_BRACKET_CLOSE ].includes(this._lexer.token.type)) {
            property = true;
            if (Generator || Get || Set || Async || Static) {
                this._syntaxError('Unexpected "' + this._lexer.token.value + '"');
            }
        } else if (Lexer.T_OPEN_PARENTHESIS !== this._lexer.token.type) {
            // Offending token
            property = true;
            this.state = state;
            if (! this._lexer.isToken(Lexer.T_SPACE) || ! Parser._includesLineTerminator(this._lexer.token.value)) {
                this._syntaxError('Unexpected "' + this._lexer.token.value + '"');
            }
        }

        return { Generator, Static, Get, Set, Async, property, MethodName: isString(MethodName) ? new AST.Identifier(null, MethodName) : MethodName };
    }

    /**
     * Parses a class body.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.ClassBody}
     *
     * @private
     */
    _parseClassBody() {
        this._expect(Lexer.T_CURLY_BRACKET_OPEN);
        const start = this._getCurrentPosition();
        this._next();

        const body = [];
        while (! this._lexer.isToken(Lexer.T_CURLY_BRACKET_CLOSE)) {
            if (this._lexer.isToken(Lexer.T_SEMICOLON)) {
                this._next();
                continue;
            }

            const start = this._getCurrentPosition();
            const { Generator, Static, Get, Set, Async, MethodName, property } = this._parseObjectMemberSignature();
            let kind = Get ? 'get' : Set ? 'set' : 'method';
            if (! Static && MethodName instanceof AST.Identifier && 'constructor' === MethodName.name) {
                kind = 'constructor';
            }

            if (! property) {
                this._expect(Lexer.T_OPEN_PARENTHESIS);
                body.push(this._parseClassMethod(start, MethodName, kind, { Static, generator: Generator, async: Async }));
            } else {
                const docblock = this._pendingDocblock;
                this._pendingDocblock = undefined;
                const decorators = this._pendingDecorators;
                this._pendingDecorators = [];

                let value = null;
                if (this._lexer.isToken(Lexer.T_ASSIGNMENT_OP)) {
                    this._next();
                    value = this._parseExpression({ maxLevel: 2 });
                }

                const property = new AST.ClassProperty(this._makeLocation(start), MethodName, value, Static);
                property.docblock = docblock || null;
                property.decorators = decorators;

                body.push(property);

                const state = this.state;
                this._expectStatementTermination();
                this.state = state;
            }

            this._skipSpaces();
        }

        this._expect(Lexer.T_CURLY_BRACKET_CLOSE);
        this._next(false);

        return new AST.ClassBody(this._makeLocation(start), body);
    }

    /**
     * Parses a class method.
     *
     * @param {[Jymfony.Component.Autoloader.Parser.AST.Position, int]} start
     * @param {null|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} id
     * @param {string} kind
     * @param {{Static: boolean, async: boolean, generator: boolean}} opts
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.ClassMethod}
     *
     * @private
     */
    _parseClassMethod(start, id, kind, opts) {
        const docblock = this._pendingDocblock;
        this._pendingDocblock = undefined;

        const decorators = this._pendingDecorators;
        this._pendingDecorators = [];

        this._expect(Lexer.T_OPEN_PARENTHESIS);
        const args = this._parseFormalParametersList();
        const body = this._parseBlockStatement();

        const method = new AST.ClassMethod(this._makeLocation(start), body, id, kind, args, opts);
        method.docblock = docblock || null;
        method.decorators = decorators;

        return method;
    }

    /**
     * Parses a block statement.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.BlockStatement}
     *
     * @private
     */
    _parseBlockStatement() {
        this._expect(Lexer.T_CURLY_BRACKET_OPEN);
        const start = this._getCurrentPosition();
        this._next();

        const statements = [];
        while (! this._lexer.isToken(Lexer.T_CURLY_BRACKET_CLOSE)) {
            statements.push(this._parseStatement());
            this._skipSpaces();
        }

        this._next(false);
        return new AST.BlockStatement(this._makeLocation(start), statements);
    }

    _parseStatement(skipStatementTermination = false) {
        const docBlock = this._pendingDocblock;
        this._pendingDocblock = undefined;
        const decorators = this._pendingDecorators;
        this._pendingDecorators = [];

        const statement = this._doParseStatement(skipStatementTermination);

        switch (true) {
            case statement instanceof AST.ClassDeclaration: {
                if (decorators.length) {
                    statement.decorators = decorators;
                }
            }

            case statement instanceof AST.ExpressionStatement:
            case statement instanceof AST.VariableDeclaration: {
                if (docBlock) {
                    statement.docblock = docBlock;
                }
            } break;

            case statement instanceof AST.ExportNamedDeclaration:
            case statement instanceof AST.ExportDefaultDeclaration: {
                if (decorators.length) {
                    statement.decorators = decorators;
                }

                if (docBlock) {
                    statement.docblock = docBlock;
                }
            } break;
        }

        return statement;
    }

    _doParseStatement(skipStatementTermination) {
        const start = this._getCurrentPosition();
        const level = this._level++;

        try {
            if (this._lexer.isToken(Lexer.T_CURLY_BRACKET_OPEN)) {
                skipStatementTermination = true;
                return this._parseBlockStatement();
            }

            switch (this._lexer.token.type) {
                case Lexer.T_DECORATOR:
                case Lexer.T_KEYWORD: {
                    const keyword = this._lexer.token.value;
                    const statement = this._parseKeyword();

                    if (statement instanceof AST.DoWhileStatement) {
                        skipStatementTermination = true;
                    } else if (0 !== level && (statement instanceof AST.ImportDeclaration ||
                        statement instanceof AST.ExportAllDeclaration ||
                        statement instanceof AST.ExportNamedDeclaration ||
                        statement instanceof AST.ExportDefaultDeclaration)) {
                        this._syntaxError('Invalid "' + keyword + '" declaration.');
                    }

                    return statement;
                }

                case Lexer.T_OPEN_SQUARE_BRACKET:
                case Lexer.T_CURLY_BRACKET_OPEN: {
                    const state = this.state;
                    try {
                        const expression = this._parseExpression();

                        return new AST.ExpressionStatement(this._makeLocation(start), expression);
                    } catch (e) {
                        this.state = state;
                        return this._parsePattern();
                    }
                }

                case Lexer.T_IDENTIFIER: {
                    if (this._lexer.isNextToken(Lexer.T_COLON)) {
                        const label = this._parseIdentifier();
                        this._next();
                        const statement = this._parseStatement(true);

                        return new AST.LabeledStatement(this._makeLocation(start), label, statement);
                    }
                } // No break

                case Lexer.T_GET:
                case Lexer.T_SET:
                case Lexer.T_YIELD:
                case Lexer.T_THIS:
                case Lexer.T_SUPER:
                case Lexer.T_OPERATOR:
                case Lexer.T_ARGUMENTS:
                case Lexer.T_OPEN_PARENTHESIS:
                case Lexer.T_TRUE:
                case Lexer.T_FALSE:
                case Lexer.T_NULL:
                case Lexer.T_NEW:
                case Lexer.T_REGEX:
                case Lexer.T_STRING:
                case Lexer.T_NUMBER: {
                    const expression = this._parseExpression();

                    return new AST.ExpressionStatement(this._makeLocation(start), expression);
                }

                case Lexer.T_THROW: {
                    return this._parseThrowStatement();
                }

                case Lexer.T_IF: {
                    return this._parseIfStatement();
                }

                case Lexer.T_RETURN: {
                    return this._parseReturnStatement();
                }

                case Lexer.T_CLASS: {
                    return this._parseClassDeclaration();
                }

                case Lexer.T_AWAIT: {
                    this._next();
                    const expression = this._parseExpression();

                    return new AST.AwaitExpression(this._makeLocation(start), expression);
                }

                case Lexer.T_SEMICOLON: {
                    this._next(true);
                    const statement = new AST.EmptyStatement(this._makeLocation(start));
                    this._skipSpaces();
                    skipStatementTermination = true;

                    return statement;
                }

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

                    const id = this._parseIdentifier();
                    this._skipSpaces();

                    this._expect(Lexer.T_OPEN_PARENTHESIS);
                    const args = this._parseFormalParametersList();
                    const body = this._parseBlockStatement();

                    return new AST.FunctionStatement(this._makeLocation(start), body, id, args, { generator, async });
                }

                default:
                    this._syntaxError('Unexpected "' + this._lexer.token.value + '"');
            }
        } catch (e) {
            skipStatementTermination = true;
            throw e;
        } finally {
            this._level--;

            if (! skipStatementTermination) {
                this._expectStatementTermination();
            }
        }
    }

    _parseFormalParametersList() {
        this._expect(Lexer.T_OPEN_PARENTHESIS);
        this._next();
        const args = [];

        while (! this._lexer.isToken(Lexer.T_CLOSED_PARENTHESIS)) {
            args.push(this._parsePattern());
            if (this._lexer.isToken(Lexer.T_COMMA)) {
                this._next();
            } else {
                this._skipSpaces();
            }
        }

        this._next();
        return args;
    }

    _parseThrowStatement() {
        this._expect(Lexer.T_THROW);

        const start = this._getCurrentPosition();
        this._next(false);

        if (this._lexer.isToken(Lexer.T_SPACE) && ! Parser._includesLineTerminator(this._lexer.token.value)) {
            this._skipSpaces();
        } else {
            this._expectStatementTermination();
            return;
        }

        const expression = this._parseExpression();

        return new AST.ThrowStatement(this._makeLocation(start), expression);
    }

    _parseIfStatement() {
        this._expect(Lexer.T_IF);

        const start = this._getCurrentPosition();
        this._next();

        this._expect(Lexer.T_OPEN_PARENTHESIS);
        this._next();

        const condition = this._parseExpression();

        this._expect(Lexer.T_CLOSED_PARENTHESIS);
        this._next();

        const statement = this._parseStatement(true);

        const state = this.state;
        if (! (statement instanceof AST.EmptyStatement)) {
            this._expectStatementTermination();
        }

        this._skipSpaces();
        let alternative;

        if (this._lexer.isToken(Lexer.T_ELSE)) {
            this._next();
            alternative = this._parseStatement(true);
        } else {
            this.state = state;
        }

        return new AST.IfStatement(this._makeLocation(start), condition, statement, alternative);
    }

    _parseReturnStatement() {
        this._expect(Lexer.T_RETURN);

        let argument = null;
        const start = this._getCurrentPosition();
        this._next(false);

        const state = this.state;

        try {
            this._expectStatementTermination();
            this.state = state;
        } catch (e) {
            this.state = state;
            this._skipSpaces();
            argument = this._parseExpression();
        }

        return new AST.ReturnStatement(this._makeLocation(start), argument);
    }
}

module.exports = Parser;
