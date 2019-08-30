const AppliedDecorator = require('./AppliedDecorator');
const ArrowFunctionExpression = require('./ArrowFunctionExpression');
const BlockStatement = require('./BlockStatement');
const CallExpression = require('./CallExpression');
const ClassMethod = require('./ClassMethod');
const ClassProperty = require('./ClassProperty');
const Identifier = require('./Identifier');
const NullLiteral = require('./NullLiteral');
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
    apply(compiler, target, id, variable) {
        this._addToConstructor(target, id, new Identifier(null, variable));

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
    compile(compiler, target, id) {
        this._addToConstructor(target, id, new ParenthesizedExpression(null, this.args[0]));

        return [];
    }

    /**
     * @param {Jymfony.Component.Autoloader.Parser.AST.Class} target
     * @param {[Jymfony.Component.Autoloader.Parser.AST.Identifier, Jymfony.Component.Autoloader.Parser.AST.ExpressionInterface]} id
     * @param {Jymfony.Component.Autoloader.Parser.AST.Identifier} callee
     */
    _addToConstructor(target, id, callee) {
        const body = [];
        if (id[1] instanceof NullLiteral) {
            body.push(new CallExpression(null, callee, [ new Identifier(null, 'this') ]));
        } else {
            const name = id[1] instanceof StringLiteral ? eval(id[1].value) : id[1];
            let member;
            for (const m of target.body.members) {
                if (m instanceof ClassMethod) {
                    if ((m.id instanceof Identifier && m.id.name === name) || m.id === name) {
                        member = m;
                        break;
                    }
                } else if (m instanceof ClassProperty) {
                    if ((m.key instanceof Identifier && m.key.name === name) || m.key === name) {
                        member = m;
                        break;
                    }
                }
            }

            body.push(new CallExpression(null, callee, [
                new Identifier(null, 'this'),
                id[1],
                member instanceof ClassProperty ? (member.value || new Identifier(null, 'undefined')) : new Identifier(null, 'undefined'),
            ]));

            if (member instanceof ClassProperty) {
                member.clearValue();
            }
        }

        if (target.hasConstructor) {
            const constructor = target.getConstructor();
            constructor.body.statements.unshift(...body);
        } else {
            target.body.addMember(new ClassMethod(null, new BlockStatement(null, body), new Identifier(null, 'constructor'), 'constructor'));
        }
    }
}

module.exports = InitializeDecorator;
