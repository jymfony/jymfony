declare namespace Jymfony.Component.Autoloader.Parser {
    import AppliedDecorator = Jymfony.Component.Autoloader.Parser.AST.AppliedDecorator;
    import BlockStatement = Jymfony.Component.Autoloader.Parser.AST.BlockStatement;
    import ClassBody = Jymfony.Component.Autoloader.Parser.AST.ClassBody;
    import ClassDeclaration = Jymfony.Component.Autoloader.Parser.AST.ClassDeclaration;
    import ClassMethod = Jymfony.Component.Autoloader.Parser.AST.ClassMethod;
    import ExpressionInterface = Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface;
    import Identifier = Jymfony.Component.Autoloader.Parser.AST.Identifier;
    import IfStatement = Jymfony.Component.Autoloader.Parser.AST.IfStatement;
    import NodeInterface = Jymfony.Component.Autoloader.Parser.AST.NodeInterface;
    import PatternInterface = Jymfony.Component.Autoloader.Parser.AST.PatternInterface;
    import Position = Jymfony.Component.Autoloader.Parser.AST.Position;
    import Program = Jymfony.Component.Autoloader.Parser.AST.Program;
    import ReturnStatement = Jymfony.Component.Autoloader.Parser.AST.ReturnStatement;
    import SourceLocation = Jymfony.Component.Autoloader.Parser.AST.SourceLocation;
    import StatementInterface = Jymfony.Component.Autoloader.Parser.AST.StatementInterface;
    import ThrowStatement = Jymfony.Component.Autoloader.Parser.AST.ThrowStatement;

    type State = {};
    type ParserPosition = [ Position, number ];

    export class Parser extends implementationOf(ExpressionParserTrait) {
        private _lexer: Lexer;
        private _input: string;
        private _lastToken: Token;
        private _lastNonBlankToken: Token;
        private _line: number;
        private _column: number;
        private _level: number;
        private _pendingDocblock: string;
        private _pendingDecorators: AppliedDecorator[];
        private _descriptorStorage: DescriptorStorage;
        private _decorators: Record<string, (location: SourceLocation, ...args: any[]) => AppliedDecorator>;
        private _esModule: boolean;

        /**
         * Constructor.
         */
        __construct(descriptorStorage: DescriptorStorage): void;
        constructor(descriptorStorage: DescriptorStorage);

        /**
         * Gets/sets the current parser state.
         */
        public state: State;

        /**
         * Parses a js script.
         */
        parse(code: string): Program;

        /**
         * Parse a token.
         */
        private _doParse(): NodeInterface;

        /**
         * Advances the internal position counters.
         */
        private _advance(value?: string): void;

        /**
         * Gets the current position.
         */
        private _getCurrentPosition(): ParserPosition;

        /**
         * Makes a location.
         */
        private _makeLocation([startPosition, inputStart]: ParserPosition): SourceLocation;

        private static _includesLineTerminator(value: string): boolean;

        /**
         * Assert there's a statement termination (newline or semicolon).
         */
        private _expectStatementTermination(): void;

        private _syntaxError(message?: string): never;
        private _expect(type): void;

        /**
         * Skip spaces and advances the internal position.
         */
        private _skipSpaces(processDecorators?: boolean): void;

        /**
         * Advance to next token.
         */
        private _next(skipSpaces?: boolean, processDecorators?: boolean): void;

        /**
         * Skips eventual semicolon.
         */
        private _skipSemicolon(): void;

        private _isPlainFor(): boolean;
        private _parseDecorator(): AppliedDecorator;

        /**
         * Initiate a keyword parsing.
         */
        private _parseKeyword(): StatementInterface;

        /**
         * Parse a pattern node.
         */
        private _parsePattern(): PatternInterface;

        /**
         * Returns an initializer if any.
         */
        private _maybeInitializer(): null | ExpressionInterface;

        /**
         * Parse and returns an identifier, if any.
         */
        private _maybeIdentifier(): null | Identifier;

        /**
         * Parse an identifier.
         */
        private _parseIdentifier(): Identifier;

        /**
         * Parses a class declaration.
         */
        private _parseClassDeclaration(): ClassDeclaration;

        /**
         * Parses a class.
         */
        private _parseClass(): [SourceLocation, ClassBody, null | Identifier, null | ExpressionInterface];

        private _parseObjectMemberSignature(acceptsPrivateMembers?: boolean): { Generator: boolean, Static: boolean, Get: boolean, Set: boolean, Async: boolean, Private: boolean, property: boolean, MethodName: ExpressionInterface };

        /**
         * Parses a class body.
         */
        private _parseClassBody(): ClassBody;

        /**
         * Parses a class method.
         */
        private _parseClassMethod(start: ParserPosition, id: null | ExpressionInterface, kind: string, opts: { Private: boolean, Static: boolean, async: boolean, generator: boolean }): ClassMethod;

        /**
         * Parses a block statement.
         */
        private _parseBlockStatement(): BlockStatement;

        private _parseStatement(skipStatementTermination?: boolean): StatementInterface;
        private _doParseStatement(skipStatementTermination: boolean): StatementInterface;
        private _parseFormalParametersList(): PatternInterface[];
        private _parseThrowStatement(): ThrowStatement;
        private _parseIfStatement(): IfStatement;
        private _parseReturnStatement(): ReturnStatement;
    }
}
