const ArrowFunctionExpression = require('./ArrowFunctionExpression');
const AssignmentExpression = require('./AssignmentExpression');
const BlockStatement = require('./BlockStatement');
const ClassMethod = require('./ClassMethod');
const ClassProperty = require('./ClassProperty');
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
        this._id = id;

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
     * @inheritdoc
     */
    compile(compiler) {
        this._prepare();

        compiler._emit('class');
        if (this._id) {
            compiler._emit(' ');
            compiler.compileNode(this._id);
        } else {
            compiler._emit(' ');
            compiler._emit('_anonymous_xΞ' + (~~(Math.random() * 1000000)).toString(16));
        }

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

                    let key = declaredField;
                    if (declaredField instanceof Identifier && declaredField.name.startsWith('#')) {
                        key = new StringLiteral(null, JSON.stringify(member.key.name));
                    }

                    fields.push(
                        new ObjectProperty(null, key, new ObjectExpression(null, [
                            new ObjectProperty(null, new Identifier(null, 'get'), new ArrowFunctionExpression(null, accessor, null, [ new Identifier(null, 'obj') ])),
                            new ObjectProperty(null, new Identifier(null, 'set'), new ArrowFunctionExpression(null, setterBody, null, [ new Identifier(null, 'obj'), new Identifier(null, 'value') ])),
                            new ObjectProperty(null, new Identifier(null, 'docblock'), statement.docblock ? new StringLiteral(null, JSON.stringify(statement.docblock)) : new NullLiteral(null)),
                        ]))
                    );
                }
            }

            if (member instanceof ClassProperty) {
                const accessor = new MemberExpression(null, member.static ? this._id : new Identifier(null, 'obj'), member.key);
                const setterBody = new AssignmentExpression(null, '=', accessor, new Identifier(null, 'value'));

                let key = member.key;
                if (member.key instanceof Identifier && member.key.name.startsWith('#')) {
                    key = new StringLiteral(null, JSON.stringify(member.key.name));
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

        members.push(new ClassMethod(
            null,
            new BlockStatement(null, [
                new ReturnStatement(null, new ObjectExpression(null, [
                    new ObjectProperty(null, new Identifier(null, 'fields'), new ObjectExpression(null, fields)),
                    new ObjectProperty(null, new Identifier(null, 'staticFields'), new ObjectExpression(null, staticFields)),
                ])),
            ]),
            new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'reflection'), false),
            'get',
            [],
            { Static: true }
        ));
    }
}

module.exports = Class;
