const ArrowFunctionExpression = require('./ArrowFunctionExpression');
const AssignmentExpression = require('./AssignmentExpression');
const BlockStatement = require('./BlockStatement');
const CallExpression = require('./CallExpression');
const ClassMethod = require('./ClassMethod');
const ClassProperty = require('./ClassProperty');
const ExpressionStatement = require('./ExpressionStatement');
const Identifier = require('./Identifier');
const MemberExpression = require('./MemberExpression');
const NodeInterface = require('./NodeInterface');
const NullLiteral = require('./NullLiteral');
const ObjectExpression = require('./ObjectExpression');
const ObjectProperty = require('./ObjectProperty');
const ReturnStatement = require('./ReturnStatement');
const StringLiteral = require('./StringLiteral');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 *
 * @abstract
 */
class Class extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.ClassBody} body
     * @param {Jymfony.Component.Autoloader.Parser.AST.Identifier|null} [id]
     * @param {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface|null} [superClass]
     */
    __construct(location, body, id = null, superClass = null) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.SourceLocation}
         */
        this.location = location;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ClassBody}
         *
         * @private
         */
        this._body = body;

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.Identifier|null}
         *
         * @private
         */
        this._id = id || new Identifier(null, '_anonymous_xΞ' + (~~(Math.random() * 1000000)).toString(16));

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface|null}
         *
         * @private
         */
        this._superClass = superClass;

        /**
         * @type {null|string}
         */
        this.docblock = null;

        /**
         * @type {null|Jymfony.Component.Autoloader.Parser.AST.AppliedDecorator[]}
         */
        this.decorators = null;
    }

    /**
     * Gets the class name.
     *
     * @return {string}
     */
    get name() {
        return this._id ? this._id.name : null;
    }

    /**
     * Gets the class identifier.
     *
     * @return {Jymfony.Component.Autoloader.Parser.AST.Identifier}
     */
    get id() {
        return this._id;
    }

    /**
     * Gets the class body.
     *
     * @return {Jymfony.Component.Autoloader.Parser.AST.ClassBody}
     */
    get body() {
        return this._body;
    }

    /**
     * Gets the superclass.
     *
     * @returns {null|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface}
     */
    get superClass() {
        return this._superClass;
    }

    /**
     * Sets the superclass.
     *
     * @param {null|Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface} superClass
     */
    set superClass(superClass) {
        this._superClass = superClass;
    }

    /**
     * Class has constructor.
     *
     * @returns {boolean}
     */
    get hasConstructor() {
        for (const member of this._body._body) {
            if (member instanceof ClassMethod) {
                const id = member._id;
                if (null !== id && 'constructor' === id._name) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Class has constructor.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.ClassMethod|null}
     */
    getConstructor() {
        for (const member of this._body._body) {
            if (member instanceof ClassMethod) {
                const id = member._id;
                if (null !== id && 'constructor' === id._name) {
                    return member;
                }
            }
        }

        return null;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        this._prepare();

        compiler._emit('class ');
        compiler.compileNode(this._id);

        if (this._superClass) {
            compiler._emit(' extends ');
            compiler.compileNode(this._superClass);
        }

        compiler._emit(' {\n');
        compiler.compileNode(this._body);
        compiler._emit('\n}\n');
    }

    _prepare() {
        if (this._prepared) {
            return;
        }

        this._prepared = true;

        const members = this._body.members;
        const fields = [];
        const staticFields = [];
        for (const member of members) {
            if (member instanceof ClassMethod && ('constructor' === member.name || '__construct' === member.name)) {
                for (const statement of member.body.statements) {
                    if (! statement.isFieldDeclaration) {
                        continue;
                    }

                    const declaredField = statement.fieldDeclarationExpression;
                    if (! (declaredField instanceof Identifier)) {
                        continue;
                    }

                    const accessor = new MemberExpression(null, new Identifier(null, 'obj'), declaredField);
                    const setterBody = new AssignmentExpression(null, '=', accessor, new Identifier(null, 'value'));

                    fields.push(
                        new ObjectProperty(null, declaredField, new ObjectExpression(null, [
                            new ObjectProperty(null, new Identifier(null, 'get'), new ArrowFunctionExpression(null, accessor, null, [ new Identifier(null, 'obj') ])),
                            new ObjectProperty(null, new Identifier(null, 'set'), new ArrowFunctionExpression(null, setterBody, null, [ new Identifier(null, 'obj'), new Identifier(null, 'value') ])),
                            new ObjectProperty(null, new Identifier(null, 'docblock'), statement.docblock ? new StringLiteral(null, JSON.stringify(statement.docblock)) : new NullLiteral(null)),
                        ]))
                    );
                }
            }

            if (member instanceof ClassProperty) {
                const accessor = new MemberExpression(
                    null,
                    member.static ? this._id : new Identifier(null, 'obj'),
                    member.private ? new Identifier(null, '#' + member.key.name) : member.key,
                    !(member.key instanceof Identifier)
                );
                const setterBody = new AssignmentExpression(null, '=', accessor, new Identifier(null, 'value'));

                let key = member.key;
                if (member.key instanceof Identifier && member.private) {
                    key = new StringLiteral(null, JSON.stringify('#' + member.key.name));
                }

                const prop = new ObjectProperty(null, key, new ObjectExpression(null, [
                    new ObjectProperty(null, new Identifier(null, 'get'), new ArrowFunctionExpression(null, accessor, null, [ new Identifier(null, 'obj') ])),
                    new ObjectProperty(null, new Identifier(null, 'set'), new ArrowFunctionExpression(null, setterBody, null, [ new Identifier(null, 'obj'), new Identifier(null, 'value') ])),
                    new ObjectProperty(null, new Identifier(null, 'docblock'), member.docblock ? new StringLiteral(null, JSON.stringify(member.docblock)) : new NullLiteral(null)),
                ]));

                if (member.static) {
                    staticFields.push(prop);
                } else {
                    fields.push(prop);
                }
            }
        }

        const reflectionFields = [
            new ObjectProperty(null, new Identifier(null, 'fields'), new ObjectExpression(null, fields)),
            new ObjectProperty(null, new Identifier(null, 'staticFields'), new ObjectExpression(null, staticFields)),
        ];

        members.push(new ClassMethod(
            null,
            new BlockStatement(null, [
                new ReturnStatement(null, new ObjectExpression(null, reflectionFields)),
            ]),
            new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'reflection'), false),
            'get',
            [],
            { Static: true }
        ));
    }

    /**
     * Compiles the docblock registration code.
     *
     * @param {Jymfony.Component.Autoloader.Parser.Compiler} compiler
     * @param {Jymfony.Component.Autoloader.Parser.AST.Identifier} id
     */
    compileDocblock(compiler, id) {
        compiler.compileNode(new ExpressionStatement(null, new AssignmentExpression(
            null, '=',
            new MemberExpression(null, id, new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'docblock'), false), true),
            this.docblock ? new StringLiteral(null, JSON.stringify(this.docblock)) : new NullLiteral(null)
        )));
        compiler._emit(';\n');

        for (const member of this._body.members) {
            if (! member.docblock || ! (member instanceof ClassMethod)) {
                continue;
            }

            if ('method' === member.kind) {
                compiler.compileNode(new ExpressionStatement(null, new AssignmentExpression(
                    null,
                    '=',
                    new MemberExpression(
                        null,
                        new MemberExpression(
                            null,
                            member.static ? id : new MemberExpression(null, id, new Identifier(null, 'prototype')),
                            member.id,
                            ! (member.id instanceof Identifier)
                        ),
                        new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'docblock'), false),
                        true,
                    ),
                    member.docblock ? new StringLiteral(null, JSON.stringify(member.docblock)) : new NullLiteral(null)
                )));
            } else if ('get' === member.kind || 'set' === member.kind) {
                compiler.compileNode(new ExpressionStatement(null, new AssignmentExpression(
                    null,
                    '=',
                    new MemberExpression(
                        null,
                        new MemberExpression(
                            null,
                            new CallExpression(null, new MemberExpression(null, new Identifier(null, 'Object'), new Identifier(null, 'getOwnPropertyDescriptor'), false), [
                                member.static ? id : new MemberExpression(null, id, new Identifier(null, 'prototype'), false),
                                member.id instanceof Identifier ? new StringLiteral(null, JSON.stringify(member.id.name)) : member.id,
                            ]),
                            new Identifier(null, member.kind),
                            false
                        ),
                        new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'docblock'), false),
                        true,
                    ),
                    member.docblock ? new StringLiteral(null, JSON.stringify(member.docblock)) : new NullLiteral(null)
                )));
            }

            compiler._emit(';\n');
        }
    }

    /**
     * Compiles the decorators upon this class.
     *
     * @param {Jymfony.Component.Autoloader.Parser.Compiler} compiler
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.StatementInterface[]}
     */
    compileDecorators(compiler) {
        /**
         * @param {Jymfony.Component.Autoloader.Parser.AST.AppliedDecorator} a
         * @param {Jymfony.Component.Autoloader.Parser.AST.AppliedDecorator} b
         */
        const sortDecorators = (a, b) => {
            const aPriority = a.priority;
            const bPriority = b.priority;

            return aPriority > bPriority ? 1 : (bPriority > aPriority ? -1 : 0);
        };

        const tail = [];
        if (null !== this.decorators && 0 !== this.decorators.length) {
            for (const decorator of this.decorators.sort(sortDecorators)) {
                tail.push(...decorator.compile(compiler, this, this));
            }
        }

        for (const member of this._body.members) {
            tail.push(...member.compileDecorators(compiler, this));
        }

        return tail;
    }
}

module.exports = Class;
