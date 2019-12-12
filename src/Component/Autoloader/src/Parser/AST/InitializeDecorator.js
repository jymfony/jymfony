const AppliedDecorator = require('./AppliedDecorator');
const ArrowFunctionExpression = require('./ArrowFunctionExpression');
const BlockStatement = require('./BlockStatement');
const CallExpression = require('./CallExpression');
const Class = require('./Class');
const ClassMethod = require('./ClassMethod');
const ClassProperty = require('./ClassProperty');
const Comment = require('./Comment');
const ExpressionStatement = require('./ExpressionStatement');
const Identifier = require('./Identifier');
const ParenthesizedExpression = require('./ParenthesizedExpression');
const StringLiteral = require('./StringLiteral');
const { createHash } = require('crypto');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class InitializeDecorator extends AppliedDecorator {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.AST.SourceLocation} location
     * @param {Jymfony.Component.Autoloader.Parser.AST.Function} callback
     */
    __construct(location, callback) {
        super.__construct(location, null, [ callback ]);
    }

    /**
     * Gets the mangled name of the callback.
     *
     * @returns {string}
     */
    get mangledName() {
        if (undefined !== this._mangled) {
            return this._mangled;
        }

        const hash = createHash('sha512');
        hash.update(JSON.stringify(this.location));

        return this._mangled = '__δdecorators__initialize' + hash.digest().toString('hex');
    }

    /**
     * @inheritdoc
     */
    apply(compiler, class_, target, variable) {
        this._addToConstructor(class_, target, new Identifier(null, variable));

        return [];
    }

    /**
     * Gets the callback expression.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.AST.Function}
     */
    get callback() {
        return new ArrowFunctionExpression(null, this.args[0]);
    }

    /**
     * @inheritdoc
     */
    compile(compiler, class_, target) {
        if (
            (target instanceof ClassProperty && (target.static || target.private)) ||
            (target instanceof ClassMethod && (target.static || target.private))
        ) {
            return [];
        }

        this._addToConstructor(class_, target, new ParenthesizedExpression(null, this.args[0]));

        return [];
    }

    /**
     * @param {Jymfony.Component.Autoloader.Parser.AST.Class} class_
     * @param {Jymfony.Component.Autoloader.Parser.AST.Class|Jymfony.Component.Autoloader.Parser.AST.ClassMemberInterface} target
     * @param {Jymfony.Component.Autoloader.Parser.AST.Identifier} callee
     */
    _addToConstructor(class_, target, callee) {
        const args = [ new Identifier(null, 'this') ];
        if (target instanceof ClassProperty || target instanceof ClassMethod) {
            const key = target instanceof ClassProperty ? target.key : target.id;
            args.push(key instanceof Identifier ? new StringLiteral(null, JSON.stringify(key.name)) : key);

            if (target instanceof ClassProperty) {
                args.push(target.value || new Identifier(null, 'undefined'));
                target.clearValue();
            }
        }

        const body = [ new CallExpression(null, callee, args) ];

        let constructor = class_.getConstructor();
        if (! constructor) {
            const constructorBody = class_.superClass ? [ new CallExpression(null, new Identifier(null, 'super'), []) ] : [];
            constructor = new ClassMethod(null, new BlockStatement(null, constructorBody), new Identifier(null, 'constructor'), 'constructor');
            class_.body.addMember(constructor);
        }

        const constructorBody = constructor.body;
        let insertIndex = 0;
        let shouldAddMarkerComment = true, index, stmt;
        for ([ index, stmt ] of __jymfony.getEntries(constructorBody.statements)) {
            if (stmt instanceof ExpressionStatement) {
                stmt = stmt.expression;
            }

            if (stmt instanceof CallExpression && stmt.callee instanceof Identifier && 'super' === stmt.callee.name) {
                insertIndex = index + 1;
            }

            if (stmt instanceof Comment && '#### __jymfony_initialize_decorator_marker__' === stmt.value) {
                insertIndex = target instanceof Class ? index + 1 : index;
                shouldAddMarkerComment = false;
                break;
            }
        }

        if (shouldAddMarkerComment) {
            body[target instanceof Class ? 'unshift' : 'push'](new Comment(null, '#### __jymfony_initialize_decorator_marker__'));
        }

        constructorBody.statements.splice(insertIndex, 0, ...body);
    }
}

module.exports = InitializeDecorator;
