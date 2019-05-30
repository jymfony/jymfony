const Lexer = require('./Lexer');
const lexer = new Lexer();

class Patcher {
    /**
     * Constructor.
     *
     * @param {string} code
     */
    constructor(code) {
        lexer.input = code;

        this._parse();
    }

    /**
     * @param {Jymfony.Component.Autoloader.Parser.Lexer} lexer
     *
     * @private
     */
    * _process(lexer) {
        let docblock = undefined;
        while (false !== lexer.moveNext()) {
            const token = lexer.token;

            switch (token.type) {
                case Lexer.T_DOCBLOCK:
                    docblock = token.value;
                    break;

                case Lexer.T_SPACE:
                    // Do nothing
                    break;

                case Lexer.T_CLASS:
                    yield this._processClass(lexer, docblock);
                    break;

                default:
                    docblock = undefined;
                    break;
            }

            if (Lexer.T_CLASS !== token.type) {
                yield token.value;
            }

            if (lexer.isNextToken(Lexer.T_CLASS)) {
                yield this._processClass(lexer, docblock);
            }
        }
    }

    /**
     * @param {Jymfony.Component.Autoloader.Parser.Lexer} lexer
     * @param {undefined|string} ClassDocblock
     *
     * @private
     */
    _processClass(lexer, ClassDocblock) {
        const classDocblock = {
            ['class']: ClassDocblock,
            methods: {},
            properties: {},
        };

        const fields = {};

        let className;
        let docblock = undefined, code = '', patchRemoval = () => {};
        let hasConstructor = false;

        if (lexer.token.type !== Lexer.T_CLASS) {
            lexer.moveNext();
        }

        code += lexer.token.value; // Class

        if (! lexer.isNextToken(Lexer.T_SPACE)) {
            throw new SyntaxError();
        }

        lexer.moveNext();
        code += lexer.token.value;

        if (lexer.isNextToken(Lexer.T_IDENTIFIER)) {
            lexer.moveNext();
            className = lexer.token.value;
            code += lexer.token.value;

            if (lexer.isNextToken(Lexer.T_SPACE)) {
                lexer.moveNext();
                code += lexer.token.value;
            }
        } else {
            className = '_anonymous_x' + (~~(Math.random() * 1000000)).toString(16);
            code += className + ' ';
        }

        if (lexer.isNextToken(Lexer.T_EXTENDS)) {
            lexer.moveNext();
            code += lexer.token.value;
        } else {
            const currentPosition = code.length;
            const extension = ' extends __jymfony.JObject ';
            patchRemoval = () => {
                code = code.slice(0, currentPosition - 1) + code.slice(currentPosition + extension.length - 1);
            };

            code += extension;
        }

        while (! lexer.isNextToken(Lexer.T_CURLY_BRACKET_OPEN)) {
            lexer.moveNext();
            code += lexer.token.value;
        }

        lexer.moveNext();
        code += lexer.token.value; // {

        let level = 1;
        let currentMethodName;
        while (level && false !== lexer.moveNext()) {
            const token = lexer.token;

            switch (token.type) {
                case Lexer.T_DOCBLOCK:
                    docblock = token.value;
                    break;

                case Lexer.T_SPACE:
                    // Do nothing
                    break;

                case Lexer.T_CURLY_BRACKET_OPEN:
                case Lexer.T_OPEN_PARENTHESIS:
                    level++;
                    docblock = undefined;
                    break;

                case Lexer.T_CURLY_BRACKET_CLOSE:
                case Lexer.T_CLOSED_PARENTHESIS:
                    if (0 === --level) {
                        currentMethodName = undefined;
                    }

                    docblock = undefined;
                    break;

                case Lexer.T_IDENTIFIER:
                    if (1 === level) {
                        let methodName = token.value;

                        let next;
                        while ((next = lexer.peek()) && next.type === Lexer.T_SPACE) {}

                        if (next.type === Lexer.T_ASSIGNMENT_OP || next.type === Lexer.T_SEMICOLON) {
                            classDocblock.properties[methodName] = docblock;
                            fields[methodName] = `{ get: (obj) => { return obj.${methodName}; }, set: (value) => { obj.${methodName} = value; } }`;
                        } else {
                            if ('get' === methodName || 'set' === methodName) {
                                if (lexer.isNextToken(Lexer.T_SPACE)) {
                                    lexer.peek();
                                    const propertyToken = lexer.peek();

                                    if (propertyToken.type === Lexer.T_IDENTIFIER) {
                                        methodName = propertyToken.value + '#' + methodName;
                                    }
                                }
                            } else if ('constructor' === methodName) {
                                hasConstructor = true;
                            }

                            classDocblock.methods[methodName] = docblock;
                            currentMethodName = methodName;
                        }
                    }

                    break;

                case Lexer.T_KEYWORD:
                    if (1 === level && 'static' === token.value && lexer.isNextToken(Lexer.T_SPACE)) {
                        lexer.peek();
                        const identifier = lexer.peek();

                        if (identifier.type === Lexer.T_IDENTIFIER) {
                            code += token.value; // Static
                            lexer.moveNext();
                            code += lexer.token.value; // Space
                            lexer.moveNext();
                            code += lexer.token.value; // Identifier

                            let next;
                            while ((next = lexer.peek()) && next.type === Lexer.T_SPACE) {}

                            if (next.type === Lexer.T_ASSIGNMENT_OP || next.type === Lexer.T_SEMICOLON) {
                                const fieldName = token.value + '::' + identifier.value;
                                classDocblock.properties[fieldName] = docblock;
                                fields[fieldName] = `{ get: () => { return ${className}.${identifier.value}; }, set: (obj, value) => { ${className}.${identifier.value} = value; } }`;
                            } else {
                                classDocblock.methods[token.value + '::' + identifier.value] = docblock;
                            }

                            continue;
                        }
                    }

                    if (docblock && 'this' === token.value &&
                        ('__construct' === currentMethodName || 'constructor' === currentMethodName)) {
                        let next;
                        while ((next = lexer.peek()).type === Lexer.T_SPACE) { }

                        if (next.type === Lexer.T_DOT) {
                            while ((next = lexer.peek()).type === Lexer.T_SPACE) { }
                            if (next.type === Lexer.T_IDENTIFIER) {
                                classDocblock.properties[next.value] = docblock;
                            }

                            if (undefined === fields[next.value]) {
                                fields[next.value] = `{ get: (obj) => { return obj.${next.value}; }, set: (obj, value) => { obj.${next.value} = value; } }`;
                            }
                        }
                    }

                default:
                    if (1 !== level || ('*' !== token.value && 'async' !== token.value)) {
                        docblock = undefined;
                    }

                    break;
            }

            if (0 === level) {
                const docblock = JSON.stringify(classDocblock);
                code += ` static [Symbol.docblock]() { return ${docblock}; } static [Symbol.reflection]() { return { fields: { ` +
                    Object.keys(fields).reduce((res, field) => res + '[' + JSON.stringify(field) + ']: ' + fields[field] + ', ', '') + '} } } '
                ;
            }

            code += token.value;

            if (lexer.isNextToken(Lexer.T_CLASS)) {
                code += this._processClass(lexer, docblock);
            }
        }

        if (hasConstructor) {
            patchRemoval();
        }

        return code;
    }

    /**
     * @private
     */
    _parse() {
        this._code = '';
        for (const block of this._process(lexer)) {
            this._code += block;
        }
    }

    /**
     * @returns {string}
     */
    get code() {
        return this._code;
    }
}

module.exports = Patcher;
